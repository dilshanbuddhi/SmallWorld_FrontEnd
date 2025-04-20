getAllbooking();
function getAllbooking() {
    $.ajax({
        url: "http://localhost:8080/api/v1/booking/getAll",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            loadTable(response.data);
        }
    });
}
function loadTable(data) {
    $("#bookingbody").empty(); // ID should match tbody ID in your HTML

    data.forEach((booking) => {
        const fullName = `${booking.user.firstName} ${booking.user.lastName}`;
        const hotelName = booking.room.hotel.name;
        const checkIn = new Date(booking.check_in_date).toLocaleDateString();
        const checkOut = new Date(booking.check_out_date).toLocaleDateString();

        let row = `<tr>
            <td>${fullName}</td>
            <td>${hotelName}</td>
            <td>${booking.num_rooms}</td>
            <td>${checkIn}</td>
            <td>${checkOut}</td>
            <td>${booking.total_price} LKR</td>
        </tr>`;
        $("#bookingbody").append(row);
    });
}
