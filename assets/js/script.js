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


// Function to fetch weather data from OpenWeatherMap using latitude and longitude
function getWeatherData(lat, lon) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=fd7f618ea9fd25705c72652935c36154`;// Build the URL for the weather forecast API request using the coordinates


    fetch(weatherApiUrl) // Fetch the weather data using the built URL

        .then(response => {
            if (!response.ok) {    // Handle the response, checking if the request was successful

                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);// Log the received data to the console or proceed to display it in the UI
            
        })
        .catch(e => {
            console.log('Error: ' + e.message);// Catch and log any errors in the fetch operation
        });
}

// Function to display current weather details
function displayCurrentWeather(weatherData) {
    console.log(weatherData);
    const currentWeatherSection = document.getElementById('current-weather-section');
    currentWeatherSection.innerHTML = ''; // Clear previous content

    // Create elements for weather details - you can expand this with more details
    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperature: ${weatherData.temp} °C`;

    // Append new elements to the current weather section
    currentWeatherSection.appendChild(temperatureElement);

    // ... (add more detailed weather information as needed)
}


// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    const cityName = document.getElementById('search-input').value;
    getCoordinates(cityName);
    
});

