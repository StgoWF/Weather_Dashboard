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