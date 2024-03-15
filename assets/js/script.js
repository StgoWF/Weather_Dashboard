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
    if (weatherData && weatherData.main && weatherData.wind) {
        console.log(weatherData); // Log the weather data to the console (optional)

        // Extract temperature, wind speed, and humidity from weatherData
        const temperature = Math.round(weatherData.main.temp - 273.15); // Convert from Kelvin to Celsius
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;

        // Get the current weather section element by its ID
        const currentWeatherSection = document.getElementById('current-weather-section');
        currentWeatherSection.innerHTML = ''; // Clear previous content

        // Create elements to display current weather details
        const temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${temperature} °C`;

        const windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;

        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${humidity}%`;

        // Append new elements to the current weather section
        currentWeatherSection.appendChild(temperatureElement);
        currentWeatherSection.appendChild(windSpeedElement);
        currentWeatherSection.appendChild(humidityElement);
    } else {
        // If weatherData is not defined or does not contain the necessary properties, log an error
        console.error('Main weather information is missing in the weather data.');
    }
}




// Function to display weather forecast, ensuring one forecast per day
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-section');
    forecastContainer.innerHTML = ''; // Clear any existing forecast content

    // Filter the forecast data to get one entry per day, ideally around midday
    const filteredForecast = forecastData.filter((item, index) => index % 8 === 0).slice(0, 5);

    filteredForecast.forEach((forecastItem) => {
        const forecastDate = new Date(forecastItem.dt * 1000);
        const dateFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const date = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(forecastDate);
        
        const temperature = Math.round(forecastItem.main.temp - 273.15); // Convert from Kelvin to Celsius
        const windSpeed = forecastItem.wind.speed;
        const humidity = forecastItem.main.humidity;
        
        const forecastItemElement = document.createElement('div');
        forecastItemElement.classList.add('forecast-item');

        forecastItemElement.innerHTML = `
            <p>Date: ${date}</p>
            <p>Temperature: ${temperature} °C</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>`;

        forecastContainer.appendChild(forecastItemElement);
    });
}




// Function to save the searched city to the search history
function saveToHistory(cityName) {
    // Get the current search history from localStorage or initialize an empty array
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Check if the cityName is already in the history to avoid duplicates
    if (!history.includes(cityName)) {
        // If cityName is not in the history, add it to the array
        history.push(cityName);
        
        // Save the updated history back to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    
    // Load and display the updated search history
    loadSearchHistory();
}

// Function to load and display the search history from localStorage
function loadSearchHistory() {
    // Retrieve the search history array from localStorage or initialize an empty array
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // Get the container element for displaying the search history
    const historyContainer = document.getElementById('search-history');
    
    // Clear any existing content in the history container
    historyContainer.innerHTML = '';

    // Loop through each city in the search history array
    history.forEach(cityName => {
        // Create a new list item element
        const listItem = document.createElement('li');
        
        // Set the text content of the list item to the cityName
        listItem.textContent = cityName;
        
        // Append the list item to the history container
        historyContainer.appendChild(listItem);
    });
}


// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    const cityName = document.getElementById('search-input').value;
    getCoordinates(cityName);
    
});

