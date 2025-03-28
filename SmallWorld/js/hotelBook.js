// Store selected room information
let selectedRoom = {
    name: "",
    pricePerNight: 0,
    nights: 1  // Default to 1 night instead of 3
};

function openBookingModal(hotelIndex) {
    // Reset selected room
    selectedRoom = {
        name: "",
        pricePerNight: 0,
        nights: 1  // Default to 1 night
    };

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

    // Update booking summary with empty selection
    updateBookingSummary();

    $.ajax({
        url: "http://localhost:8080/api/v1/room/getAllByHotelId/" + hotel.id,
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            console.log(data);
            let rooms = data.data;
            $("#room-cards").empty();

            // Add night selection controls to the header
            const checkInDate = new Date(2025, 2, 15); // March 15, 2025
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + selectedRoom.nights);

            const formattedCheckIn = formatDate(checkInDate);
            const formattedCheckOut = formatDate(checkOutDate);

            $("#room-cards").append(`
                <h3>Select Your Room</h3>
                <div class="night-selector">
                    <button class="night-btn decrease-night" ${selectedRoom.nights <= 1 ? 'disabled' : ''}>-</button>
                     <span id="nights-count">${selectedRoom.nights}</span> night${selectedRoom.nights !== 1 ? 's' : ''}
                    <button class="night-btn increase-night">+</button>
                </div>
                </p>
            `);

            rooms.forEach((room, index) => {
                // Convert price to number and format for display
                const priceNumber = parseFloat(room.price);
                const formattedPrice = priceNumber.toLocaleString();

                $("#room-cards").append(`
                    <div class="room-card" data-room-id="${index}" data-room-name="${room.room_type.room_type}" data-room-price="${priceNumber}">
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
                            <div class="price">${formattedPrice} LKR</div>
                            <span class="price-period">per night</span>
                            <button class="select-button" onclick="selectRoom(${index}, '${room.room_type.room_type}', ${priceNumber})">Select</button>
                        </div>
                    </div>
                `);
            });

            // Attach event handlers for the night selection buttons
            $(".increase-night").click(function() {
                selectedRoom.nights++;
                updateNightsDisplay();
                updateBookingSummary();
            });

            $(".decrease-night").click(function() {
                if (selectedRoom.nights > 1) {
                    selectedRoom.nights--;
                    updateNightsDisplay();
                    updateBookingSummary();
                }
            });
        },
        error: function (err) {
            console.error("Error fetching data:", err);
        }
    });

    // Show the modal
    document.getElementById('bookingModal').style.display = 'flex';
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function updateNightsDisplay() {
    // Update the nights count in the UI
    $("#nights-count").text(selectedRoom.nights);

    // Update singular/plural for "night(s)"
    const nightText = selectedRoom.nights === 1 ? 'night' : 'nights';
    $("#nights-count").next().text(` ${nightText}`);

    // Update the check-out date based on the number of nights
    const checkInDate = new Date(2025, 2, 15); // March 15, 2025
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + selectedRoom.nights);

    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    // Update the check-in/check-out text
    const dateText = `Check-in: ${formattedCheckIn} — Check-out: ${formattedCheckOut} —`;
    $(".night-selector").parent().contents().first().replaceWith(dateText);

    // Enable/disable the decrease button based on the number of nights
    if (selectedRoom.nights <= 1) {
        $(".decrease-night").prop('disabled', true);
    } else {
        $(".decrease-night").prop('disabled', false);
    }
}

function selectRoom(roomIndex, roomName, roomPrice) {
    // Update selected room
    selectedRoom.name = roomName;
    selectedRoom.pricePerNight = roomPrice;

    // Highlight the selected room
    $(".room-card").removeClass("selected-room");
    $(`.room-card[data-room-id="${roomIndex}"]`).addClass("selected-room");

    // Update the booking summary
    updateBookingSummary();
}

function updateBookingSummary() {
    // Calculate total room cost and taxes
    const roomTotal = selectedRoom.pricePerNight * selectedRoom.nights;
    const taxes = roomTotal * 0.1; // 10% tax rate
    const grandTotal = roomTotal + taxes;

    // Format the summary HTML
    let summaryHTML = '<h3>Booking Summary</h3>';

    if (selectedRoom.name) {
        // If a room is selected, show the full summary
        summaryHTML += `
            <div style="display: flex; justify-content: space-between; margin-top: 15px;">
                <div>${selectedRoom.name} (${selectedRoom.nights} night${selectedRoom.nights !== 1 ? 's' : ''})</div>
                <div>${roomTotal.toLocaleString()} LKR</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                <div>Taxes and fees (10%)</div>
                <div>${taxes.toLocaleString()} LKR</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-weight: bold;">
                <div>Total</div>
                <div>${grandTotal.toLocaleString()} LKR</div>
            </div>
        `;
    } else {
        // If no room is selected, show a message
        summaryHTML += `
            <div style="margin: 15px 0; color: var(--gray);">
                Please select a room to see booking details
            </div>
        `;
    }

    // Add payment section
    summaryHTML += `
        <h4>Payment Method</h4>
        <div class="payment-methods">
            <div class="payment-method active">Credit Card</div>
            <div class="payment-method">PayPal</div>
            <div class="payment-method">Bank Transfer</div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input type="text" id="cardNumber">
            </div>
            <div class="form-group">
                <label for="cardName">Name on Card</label>
                <input type="text" id="cardName">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="expiry">Expiry Date</label>
                <input type="text" id="expiry" placeholder="MM/YY">
            </div>
            <div class="form-group">
                <label for="cvv">CVV</label>
                <input type="text" id="cvv">
            </div>
        </div>

        <button class="confirm-button" ${selectedRoom.name ? '' : 'disabled'}>Confirm Booking</button>
    `;

    // Update the booking summary section
    $(".booking-summary").html(summaryHTML);

    // Add event listeners for payment methods
    $(".payment-method").click(function() {
        $(".payment-method").removeClass("active");
        $(this).addClass("active");
    });
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

// Initialize
$(document).ready(function() {
    getAllHotels();

    // Handle payment method selection
    $(document).on('click', '.payment-method', function() {
        $('.payment-method').removeClass('active');
        $(this).addClass('active');
    });
});