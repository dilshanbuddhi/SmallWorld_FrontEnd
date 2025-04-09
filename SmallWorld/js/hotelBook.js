// Store selected room information
let payMethod = "Credit card";
document.addEventListener("DOMContentLoaded", function () {
    const paymentMethods = document.querySelectorAll(".payment-method");

    paymentMethods.forEach(method => {
        method.addEventListener("click", function () {
            // Remove 'active' class from all methods
            paymentMethods.forEach(m => m.classList.remove("active"));

            // Add 'active' class to the clicked method
            this.classList.add("active");

            // Get the selected value
            payMethod=this.textContent.trim();
            //console.log("Selected Payment Method:", this.textContent.trim());
        });
    });
});

let selectedRoom = {
    name: "",
    pricePerNight: 0,
    nights: 1,  // Default to 1 night instead of 3
    roomId: null // Add room ID property
};

function openBookingModal(hotelIndex) {
    // Reset selected room
    selectedRoom = {
        name: "",
        pricePerNight: 0,
        nights: 1,  // Default to 1 night
        roomId: null // Add room ID property
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
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDgyMTMyLCJleHAiOjE3NDQ1MTg5MzJ9.YRFhZUVduq6AxUvuIrri_zxmSmp0fu0CwJI5qkLvPOd8VQArqAlXYlCy2YU7qrusBmMSP8F4l9ExNJleT24lVg"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            console.log(data);
            let rooms = data.data;
            $("#room-cards").empty();

            // Add night selection controls to the header
            const checkInDate = new Date();
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
                    <div class="room-card" data-room-id="${room.id}" data-room-name="${room.room_type.room_type}" data-room-price="${priceNumber}">
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
                                <p style="color: #1e7e34">Available Rooms :${room.availableRooms}</p>

                        </div>
                        <div class="room-price">
                            <div class="price">${formattedPrice} LKR</div>
                            <span class="price-period">per night</span>
                            <button class="select-button" onclick="selectRoom(${room.id}, '${room.room_type.room_type}', ${priceNumber})">Select</button>
                          
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
    const checkInDate = new Date(); // March 15, 2025
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

function selectRoom(roomId, roomName, roomPrice) {
    // Update selected room
    selectedRoom.name = roomName;
    selectedRoom.pricePerNight = roomPrice;
    selectedRoom.roomId = roomId; // Store the room ID

    // Highlight the selected room
    $(".room-card").removeClass("selected-room");
    $(`.room-card[data-room-id="${roomId}"]`).addClass("selected-room");

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

        <button class="confirm-button" ${selectedRoom.name ? '' : 'disabled'} onclick="confirmBooking()">Confirm Booking</button>
    `;

    // Update the booking summary section
    $(".booking-summary").html(summaryHTML);

    // Add event listeners for payment methods
    $(".payment-method").click(function() {
        $(".payment-method").removeClass("active");
        $(this).addClass("active");
    });
}

function confirmBooking() {
    // Calculate check-in and check-out dates
    const checkInDate = new Date();
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + selectedRoom.nights);

    // Format dates as ISO strings (YYYY-MM-DD)
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

    // Calculate total price (including taxes)
    const roomTotal = selectedRoom.pricePerNight * selectedRoom.nights;
    const taxes = roomTotal * 0.1; // 10% tax rate
    const grandTotal = roomTotal + taxes;

    // Current date for booking_date
    const bookingDate = new Date().toISOString().split('T')[0];

    // Create booking data object
    const bookingData = {
        room_id: selectedRoom.roomId,
        check_in_date: formattedCheckIn,
        check_out_date: formattedCheckOut,
        num_rooms: 1,
        total_price: grandTotal,
        status: "Completed",
        booking_date: bookingDate,
        paymentMethod : payMethod,
    };

    const paymentData = {
        paymentMethod : payMethod,
        amount : grandTotal
    }

    console.log("Booking Data:", bookingData);



    // Validate payment information
    const cardNumber = $("#cardNumber").val();
    const cardName = $("#cardName").val();
    const expiry = $("#expiry").val();
    const cvv = $("#cvv").val();

    if (!cardNumber || !cardName || !expiry || !cvv) {
        alert("Please fill in all payment details");
        return;
    }



    //console.log(bookingData);

    // Send booking data to server

    $.ajax({
        url: "http://localhost:8080/api/v1/booking/save",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDgyMTMyLCJleHAiOjE3NDQ1MTg5MzJ9.YRFhZUVduq6AxUvuIrri_zxmSmp0fu0CwJI5qkLvPOd8VQArqAlXYlCy2YU7qrusBmMSP8F4l9ExNJleT24lVg"
        },
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(bookingData),
        dataType: "json",
        success: function(response) {
            console.log("Booking successful:", response);

            // Show success message to user
            $(".modal-content").html(`
                <div class="booking-confirmation">
                    <div class="confirmation-icon">✅</div>
                    <h2>Booking Confirmed!</h2>
                    <p>Your booking at ${$(".hotel-detail h2").text()} has been confirmed.</p>
                    <p>Check-in: ${formatDate(checkInDate)}</p>
                    <p>Check-out: ${formatDate(checkOutDate)}</p>
                    <p>Room: ${selectedRoom.name}</p>
                    <p>Total: ${grandTotal.toLocaleString()} LKR</p>
                    <p>A confirmation email has been sent to your email address.</p>
                    <button class="confirm-button" onclick="closeBookingModal()">Close</button>
                </div>
            `);
        },
        error: function(error) {
            console.error("Booking error:", error);
            alert("There was an error processing your booking. Please try again.");
        }
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
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDgyMTMyLCJleHAiOjE3NDQ1MTg5MzJ9.YRFhZUVduq6AxUvuIrri_zxmSmp0fu0CwJI5qkLvPOd8VQArqAlXYlCy2YU7qrusBmMSP8F4l9ExNJleT24lVg"
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

function getAllByCity(city) {
    $.ajax({
        url: "http://localhost:8080/api/v1/hotel/getAllByCity/" + city,
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNDgyMTMyLCJleHAiOjE3NDQ1MTg5MzJ9.YRFhZUVduq6AxUvuIrri_zxmSmp0fu0CwJI5qkLvPOd8VQArqAlXYlCy2YU7qrusBmMSP8F4l9ExNJleT24lVg"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            getAllHotels.hotelData = data;

            $("#hotel-city").text("Hotels in " + city + "(" + data.data.length + " Results)");
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

// Initialize
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);

    const city = urlParams.get('city');
    console.log(city   , "    hyuhuuhu");
    if (city) {
        getAllByCity(city);
    }else {
        getAllHotels();
    }
    // Handle payment method selection
    $(document).on('click', '.payment-method', function() {
        $('.payment-method').removeClass('active');
        $(this).addClass('active');
    });

    // Add CSS for booking confirmation success message
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .booking-confirmation {
                text-align: center;
                padding: 40px 20px;
                max-width: 500px;
                margin: 0 auto;
            }
            .confirmation-icon {
                font-size: 60px;
                margin-bottom: 20px;
            }
            .booking-confirmation h2 {
                margin-bottom: 20px;
                color: #4CAF50;
            }
            .booking-confirmation p {
                margin-bottom: 10px;
                font-size: 16px;
            }
        `)
        .appendTo('head');
});