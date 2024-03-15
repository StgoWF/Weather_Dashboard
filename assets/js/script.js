function saveToHistory(cityName) {
        // Capitalize the city name
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(history));

        // Log para verificar que la ciudad ha sido añadida
        console.log(`Saved ${cityName} to search history.`, history);
    } else {
        // Log para informar que la ciudad ya estaba en la historia
        console.log(`${cityName} is already in the search history.`);
    }

    loadSearchHistory(); // No olvides llamar a esta función para actualizar la visualización de la historia
}


// Function to load and display the search history from localStorage
function loadSearchHistory() {
    // Retrieve the search history array from localStorage or initialize it as an empty array if none exists
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // Get the container element for displaying the search history
    const historyContainer = document.getElementById('search-history');
    
    // Clear any existing content in the history container
    historyContainer.innerHTML = '';

    // Loop through each city in the search history array and create a list item for each
    history.forEach(cityName => {
        // Create a new button element for the city
        const cityButton = document.createElement('button');
        
        // Set the text content of the button to the city name and add a class for styling
        cityButton.textContent = cityName;
        cityButton.classList.add('city-button');
        
        // Add a click event listener to each button to re-fetch and display the weather when clicked
        cityButton.addEventListener('click', () => {
            getCoordinates(cityName); // Assuming you have a function called getCoordinates that fetches the weather data
        });

        // Append the button to the history container element
        historyContainer.appendChild(cityButton);
    });
}






// Assign your OpenWeatherMap API key to a constant for easy maintenance
const apiKey = 'fd7f618ea9fd25705c72652935c36154';
// Function to retrieve coordinates from the OpenWeatherMap Geocoding API
function getCoordinates(cityName) {
    // Construct the URL for the Geocoding API request using the city name
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

    // Make the API call to OpenWeatherMap to get the geolocation data for the city
    fetch(geocodingApiUrl)
        .then(response => {
            if (!response.ok) {
                // If the response is not successful, throw an error with the response status
                throw new Error(`Network response was not ok - check your API key and the city name`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                // Capture the latitude and longitude from the data
                const { lat, lon } = data[0];
                // Pass the latitude, longitude, and the city name to the getWeatherData function
                getWeatherData(lat, lon, cityName); // Pass the cityName here
            } else {
                console.error('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
        });
}




function getWeatherData(lat, lon, cityName) {
    // Construct the URL for the weather API request using the provided latitude and longitude
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Make the API call to OpenWeatherMap to get the weather data for the given coordinates
    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                // If the response is not successful, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Log the entire weather data object to inspect its structure (optional)
            console.log(data);
            if (data && data.list && data.list.length > 0) {
                // If the weather data is successfully retrieved and contains expected data,
                // display current weather and forecast using the retrieved data
                displayCurrentWeather(data.list[0], cityName); // Pass the cityName here
                displayForecast(data.list); // Display weather forecast using the list array
                
                // Save the city name to the search history after successfully fetching the weather data
                saveToHistory(cityName);
            } else {
                // Log an error if the weather data format is incorrect or missing data
                console.error('Weather data format is incorrect.');
            }
        })
        .catch(error => {
            // Log any errors that occur during the fetch operation
            console.error('Error fetching weather data:', error);
        });
}
 

// Function to display current weather details
function displayCurrentWeather(weatherData, cityName) {

    
    // Verify if weatherData is defined and contains the necessary properties
    if (weatherData && weatherData.main && weatherData.wind && weatherData.weather) {
        // Log the weather data to the console for debugging
        console.log(weatherData);

        // Create a new Date object and format it to a readable string
        const currentDate = new Date();
        const dateFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(currentDate);

        // Extract temperature, wind speed, and humidity from weatherData
        const temperature = Math.round(weatherData.main.temp - 273.15); // Convert from Kelvin to Celsius
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;

        // Get the current weather section element by its ID and clear previous content
        const currentWeatherSection = document.getElementById('current-weather-section');
        currentWeatherSection.innerHTML = '';
                
         // Create and append an element to display the city name
         const cityNameElement = document.createElement('h2');
         cityNameElement.textContent = cityName; // This will be your cityName variable
         cityNameElement.style.color = 'white'; // Set the text color to white
         cityNameElement.style.fontWeight = 'bold'; // Make the text bold
         cityNameElement.style.textTransform = 'capitalize'; // Capitalize each word
         currentWeatherSection.appendChild(cityNameElement);
 


        // Create and style the paragraph element for the current date
        const dateElement = document.createElement('p');
        dateElement.textContent = formattedDate;
        dateElement.innerHTML = `<strong>${formattedDate}</strong>`;

        dateElement.style.color = 'white';
        currentWeatherSection.appendChild(dateElement);

        // Get the weather icon code from weatherData
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create and append the weather icon image
        const weatherIcon = document.createElement('img');
        weatherIcon.src = iconUrl;
        weatherIcon.alt = weatherData.weather[0].description;
        weatherIcon.style.width = '100px'; // Adjust the width as needed
        weatherIcon.style.height = 'auto'; // Maintain aspect ratio
        currentWeatherSection.appendChild(weatherIcon);

        // Create and style elements to display the weather details in bold and white
        const temperatureElement = document.createElement('p');
        temperatureElement.innerHTML = `<strong>Temperature:</strong> ${temperature} °C`;
        temperatureElement.style.color = 'white';

        const windSpeedElement = document.createElement('p');
        windSpeedElement.innerHTML = `<strong>Wind Speed:</strong> ${windSpeed} m/s`;
        windSpeedElement.style.color = 'white';

        const humidityElement = document.createElement('p');
        humidityElement.innerHTML = `<strong>Humidity:</strong> ${humidity}%`;
        humidityElement.style.color = 'white';

        // Append the new elements to the current weather section
        currentWeatherSection.appendChild(temperatureElement);
        currentWeatherSection.appendChild(windSpeedElement);
        currentWeatherSection.appendChild(humidityElement);

        // Optionally, add a class to style the card when data is present
        currentWeatherSection.classList.add('weather-card-with-data');
    } else {
        // Log an error if the necessary weather information is missing
        console.error('Main weather information is missing in the weather data.');
    }
}



// Function to display weather forecast, ensuring one forecast per day
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-section');
    forecastContainer.innerHTML = ''; // Clear any existing forecast content

    // Create and append the 5-Day Forecast title
    const forecastTitle = document.createElement('h2');
    forecastTitle.textContent = '5-Day Forecast:';
    forecastContainer.appendChild(forecastTitle);

    // Filter the forecast data to get one entry per day, ideally around midday
    const filteredForecast = forecastData.filter((item, index) => index % 8 === 0).slice(0, 5);

    // Iterate over each filtered forecast data item
    filteredForecast.forEach((forecastItem) => {
        const forecastDate = new Date(forecastItem.dt * 1000);
        const dateFormatOptions = { weekday: 'long', month: 'numeric', day: 'numeric' };
        const date = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(forecastDate);
        
        const temperature = Math.round(forecastItem.main.temp - 273.15); // Convert from Kelvin to Celsius
        const windSpeed = forecastItem.wind.speed;
        const humidity = forecastItem.main.humidity;

        // Get weather icon code from the forecastItem
        const iconCode = forecastItem.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Create an img element for the weather icon
        const weatherIcon = document.createElement('img');
        weatherIcon.src = iconUrl;
        weatherIcon.alt = forecastItem.weather[0].description;
        weatherIcon.classList.add('weather-icon'); // Ensure you have CSS for this class to control size, etc.

        // Create a container for this forecast item
        const forecastItemElement = document.createElement('div');
        forecastItemElement.classList.add('forecast-item');

        // Build the inner HTML for the forecast item with bold and white text
        const innerHTMLContent = `
            <p class="forecast-date" style="color: white;"><strong>${date}</strong></p>
            <div class="weather-icon-container">
                <img src="${iconUrl}" alt="${forecastItem.weather[0].description}" class="weather-icon">
            </div>
            <p style="color: white;"><strong>Temp:</strong> ${temperature} °C</p>
            <p style="color: white;"><strong>Wind:</strong> ${windSpeed} m/s</p>
            <p style="color: white;"><strong>Humidity:</strong> ${humidity}%</p>
        `;
        forecastItemElement.innerHTML = innerHTMLContent;
        
        // Append the forecast item element to the forecast container
        forecastContainer.appendChild(forecastItemElement);
    });
}







// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    const cityName = document.getElementById('search-input').value;
    getCoordinates(cityName);
    
});

// Event listener to load the search history as soon as the window is fully loaded
// This ensures that all DOM elements are accessible and the page is ready
window.addEventListener('load', loadSearchHistory);
