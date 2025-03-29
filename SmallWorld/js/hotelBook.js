
function openBookingModal(hotelIndex) {
    // Get the specific hotel data from the previous ajax call
    const hotel = getAllHotels.hotelData.data[hotelIndex];

    // Update modal header
    $("#card-test").text(hotel.name);

    // Update hotel details
    $(".detail-image").css("background-image", `url('${hotel.image[0]}')`);
    $(".hotel-detail h2").text(hotel.name);
    $(".hotel-location").text(`📍 ${hotel.location} - 2.3 km from center`);
    $("#desc").text(hotel.description);
    // Update hotel features
    $(".hotel-features").html(hotel.amenities.map(amenity =>
        `<div class="feature">${getAmenityIcon(amenity)} ${amenity}</div>`
    ).join(''));

    $.ajax({
        url: "http://localhost:8080/api/v1/room/getAllByHotelId/" + hotel.id,
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
     success : function (data) {
         console.log(data);
         let room = data.data;
         $("#room-cards").empty();
         $("#room-cards").append(`
         <h3>Select Your Room</h3>
         <p>Check-in: March 15, 2025 — Check-out: March 18, 2025 — 3 nights</p>
         `)
         room.forEach((room, index) => {
             $("#room-cards").append(`
                             <div class="room-card">
                    <div class="room-image" style="background-image: url('/api/placeholder/150/90');"></div>
                    <div class="room-details">
                        <h4>${room.room_type.room_type}</h4>
                        <p>${room.room_type.description}</p>
                        <div class="room-features">
                            <div class="room-feature">${room.room_type.amenities[0]}</div>
                            <div class="room-feature">${room.room_type.amenities[1]}</div>
                            <div class="room-feature">${room.room_type.amenities[2]}</div>
                            <div class="room-feature">${room.room_type.amenities[3]}</div>
                            <div class="room-feature">Mini bar</div>
                            <div class="room-feature">Balcony</div>
                            <div class="room-feature">Separate living area</div>
                        </div>
                    </div>
                    <div class="room-price">
                        <div class="price">${room.price}</div>
                        <span class="price-period">per night</span>
                        <button class="select-button">Select</button>
                    </div>
                </div>

`)
         })
     },
     error: function (err) {
         console.error("Error fetching data:", err);
     }
    });
    // Show the modal
    document.getElementById('bookingModal').style.display = 'flex';
}

function getAmenityIcon(amenity) {
    const amenityIcons = {
        'Pool': '🏊‍♂️',
        'Restaurant': '🍽️',
        'Parking': '🅿️',
        'Beach Access': '🏖️',
        'Spa': '💆‍♀️',
        'Airport Shuttle': '🚌'
    };
    return amenityIcons[amenity] || '🏨';
}

// Modify the original ajax success to store hotel data
function getAllHotels() {
    $.ajax({
        url: "http://localhost:8080/api/v1/hotel/getAll",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            // Store the hotel data for later use
            getAllHotels.hotelData = data;

            console.log(data);
            $("#hotel-cards").empty();
                data.data.forEach((hotel, index) => {
                const hotelCard = `
                    <div class="hotel-card" data-hotel-id="${index}">
                        <div class="hotel-image" style="background-image: url('${hotel.image[0]}');"></div>
                        <div class="hotel-content">
                            <div class="hotel-price">Beach Resort <span style="font-size: 14px; font-weight: normal; color: var(--gray);">/ Day/ Night</span></div>
                            <h3 class="hotel-title">${hotel.name}</h3>
                            <div class="hotel-location">📍, ${hotel.location}</div>

                            <div class="hotel-features">
                                <div class="feature">🏊‍♂️, ${hotel.amenities[0]}</div>
                                <div class="feature">🍽️, ${hotel.amenities[1]}</div>
                                <div class="feature">🅿️, ${hotel.amenities[2]}</div>
                            </div>

                            <div class="hotel-rating">
                                <div class="rating">
                                    <span class="rating-number">4.8</span>
                                    <span class="rating-count">(423 reviews)</span>
                                </div>
                                <button class="book-button" onclick="openBookingModal(${index})">Book Now</button>
                            </div>
                        </div>
                    </div>
                `;
                $("#hotel-cards").append(hotelCard);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

getAllHotels();