// Assign your OpenWeatherMap API key to a constant for easy maintenance
const apiKey = 'fd7f618ea9fd25705c72652935c36154';

// Function to retrieve coordinates from the OpenWeatherMap Geocoding API
function getCoordinates(cityName) {    // Construct the URL for the Geocoding API request using the city name

    
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;    // Make the API call to OpenWeatherMap to get the geolocation data for the city


    fetch(geocodingApiUrl)
        .then(response => {
            if (!response.ok) {    // If the response is successful, extract the latitude and longitude from the data

                throw new Error('Network response was not ok - check your API key and the city name');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {    // If there's an error, log it to the console

                const { lat, lon } = data[0];
                getWeatherData(lat, lon); 
            } else {
                console.error('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching geolocation data:', error);
        });
}


function getWeatherData(lat, lon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fd7f618ea9fd25705c72652935c36154`;

    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the entire weather data object to inspect its structure
            if (data && data.list && data.list.length > 0) {
                displayCurrentWeather(data.list[0]); // Display current weather from the first entry in the list
                displayForecast(data.list); // Display weather forecast using the list array
            } else {
                console.error('Weather data format is incorrect.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


// Function to display current weather details
function displayCurrentWeather(weatherData) {
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

