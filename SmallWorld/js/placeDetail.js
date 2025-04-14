let placeLat;
let placeLon;

    $(document).ready(function () {
    // Get the category ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    console.log(placeId);
    const city = urlParams.get('city');
    console.log(city);

$("#hotel-discover").on("click", function() {
    window.location.href = "hotelBook.html?city=" + city;
})
    // Fetch category details using the ID
    $.ajax({
    url: `http://localhost:8080/api/v1/place/getOne/${placeId}`,
        /*headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDk3NDkxLCJleHAiOjE3NDQ1MzQyOTF9.HlRWspJ5JnrD-dyj-Lp416hnZ5RAMqdC4G_gYBg7Ls32RyI3Uj1W4LCYSGYBef6ec8i7zXJTqf1AzbGmoE345Q"
        },*/
    type: "GET",
    success: function (response) {
    if (response.code === 200 && response.data) {

       $("#image-set").empty();

       $("#image-set").append(`
       <div class="carousel-item active">
                                    <img src="${response.data.image[0]}"
                                         class="d-block w-100 gallery-image"
                                         alt="Ella Rock View 1"
                                         style="max-height: 500px; object-fit: cover;">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5 class="text-white bg-dark bg-opacity-50 p-2 rounded">Panoramic Mountain View</h5>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="${response.data.image[1]}"
                                         class="d-block w-100 gallery-image"
                                         alt="Ella Rock View 2"
                                         style="max-height: 500px; object-fit: cover;">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5 class="text-white bg-dark bg-opacity-50 p-2 rounded">Lush Green Landscape</h5>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <img src="${response.data.image[2]}"
                                         class="d-block w-100 gallery-image"
                                         alt="Ella Rock View 3"
                                         style="max-height: 500px; object-fit: cover;">
                                    <div class="carousel-caption d-none d-md-block">
                                        <h5 class="text-white bg-dark bg-opacity-50 p-2 rounded">Scenic Hiking Trail</h5>
                                    </div>
                                </div>
       `);

        let place = response.data;
        $('#place-name').text(place.name);
        $('#category').text(place.category.name);
        $('#description').text(place.description);
        $('#place-location').text(place.location);
        $('#about-name').text(place.name);

console.log(response.data.latitude);
console.log(response.data.longitude);
         placeLat = parseFloat(response.data.latitude); // Ensure it's a number
         placeLon = parseFloat(response.data.longitude); // Ensure it's a number


        displayWeather(placeLat , placeLon);
} else {
    console.error("Failed to fetch category details: ", response.message);
}
},
    error: function (error) {
    console.error("An error occurred while fetching category details:", error);
}
});

    getPlacesByCity();

        function getPlacesByCity() {
            $.ajax({
                url: 'http://localhost:8080/api/v1/place/getAllByCity/' + city,
                method: 'GET',
                dataType: 'json',
                /*headers: {
                    Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDk3NDkxLCJleHAiOjE3NDQ1MzQyOTF9.HlRWspJ5JnrD-dyj-Lp416hnZ5RAMqdC4G_gYBg7Ls32RyI3Uj1W4LCYSGYBef6ec8i7zXJTqf1AzbGmoE345Q"
                },*/

                success: function (data) {
                    console.log(data);
                    if (data.code === 200 && data.data) {
                        $("#places").empty();
                        $("#places").append(
                            ` <div class="col-12 mb-3">
                            <h4>Popular Destinations in ${city}</h4>
                            <div class="line-dec"></div>
                        </div>`
                        );
                        for (let i = 0; i < data.data.length; i++) {
                            let place = data.data[i];
                            $("#places").append(`
                                                    <div class="col-md-6">
                                <div class="popular-place">
                                    <div class="place-img">
                                        <img src="${place.image[0]}" alt="Beach destination">
                                        <span class="place-tag">${place.category.name} </span>
                                    </div>
                                    <div class="place-info">
                                        <h5 class="place-title">${place.name} </h5>
                                        <p class="place-location"><i class="fas fa-map-marker-alt"></i> ${place.location}</p>
                                        <div class="weather-info">
                                            <i class="fas fa-sun"></i> 32°C Sunny
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="rating">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="far fa-star"></i>
                                                <span class="text-muted ml-1">(128)</span>
                                            </div>
                                            <a href="placeDetail.html?id=${place.id}&city=${place.city}" class="outline-btn">View Details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    `);
                        }
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            })


        }
    });


let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 6.7106, lng: 79.9074 }, // Default center at Panadura
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLocation = {
                    lat: position.coords.latitude,  // Get the latitude
                    lng: position.coords.longitude, // Get the longitude
                };

                // Call the function to calculate and display the route
                calculateAndDisplayRoute(currentLocation);
            },
            () => {
                alert("Error: Unable to fetch your location."); // Handle errors
            }
        );
    } else {
        alert("Error: Geolocation is not supported by this browser.");
    }

}

// Function to calculate and display the route
function calculateAndDisplayRoute(currentLocation) {
    const destination = { lat: placeLat, lng: placeLon }; // Destination: Kandy

    directionsService.route(
        {
            origin: currentLocation,    // User's current location
            destination: destination,   // Destination (Kandy)
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);

                // Extract the distance and log it to the console
                const route = response.routes[0];
                const totalDistance = route.legs[0].distance.text; // Distance (text includes units, e.g., "98.4 km")
                $('#destination').text(totalDistance,' KM from your current location');
            } else {
                alert("Directions request failed due to " + status);
            }
        }
    );
}


function displayWeather(lat, lon) {
    const API_KEY = "0f5a59c0195c49bd3f46100d858fcdea";
    const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            // First card: Update weather details dynamically
            document.getElementById("temperature").textContent = `${data.main.temp}°C | ${data.weather[0].description}`;
            document.getElementById("humidity").textContent = `${data.main.humidity}%`;
            document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`; // This updates both cards' wind speed

            // Optionally, change the weather icon based on weather condition
            const weatherIcon = data.weather[0].main.toLowerCase();
            let iconName = "cloud"; // Default icon

            if (weatherIcon.includes("rain")) {
                iconName = "cloud-rain";
            } else if (weatherIcon.includes("clear")) {
                iconName = "sun";
            } else if (weatherIcon.includes("cloud")) {
                iconName = "cloud";
            }

            document.getElementById("weather-icon").setAttribute("data-feather", iconName);
            feather.replace(); // Re-render Feather icons for the first card

            // Second card: Update location, wind speed, and pressure
            document.getElementById("location").textContent = data.name; // City name as location
            document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;
            document.getElementById("feel-like").textContent =  formatTime(data.sys.sunrise); // Updates wind speed for both cards

            // Optionally, set a wind-related icon (e.g., "wind")
            document.getElementById("wind-icon").setAttribute("data-feather", "wind");
            feather.replace(); // Re-render Feather icons for the second card
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}


/*
// Example coordinates (latitude and longitude)
const latitude = 6.9271;  // Replace with actual latitude
const longitude = 79.8612; // Replace with actual longitude


*/
