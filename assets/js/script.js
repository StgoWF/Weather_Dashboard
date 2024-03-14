// Your OpenWeatherMap API Key
const apiKey = 'fd7f618ea9fd25705c72652935c36154';

function getCoordinates(cityName) {
    
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok - check your API key and the city name');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
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


// Function to retrieve weather data using the coordinates
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
            console.log(data);
            // Now you can proceed to display this data on your webpage
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        });
}


// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function() {
    const cityName = document.getElementById('search-input').value;
    getCoordinates(cityName);
    // Further code to handle updating the UI and saving to search history
});
