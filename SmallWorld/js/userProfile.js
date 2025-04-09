getLiveUserDetail();

function getLiveUserDetail(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/profile',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $('#email').text(response.data.email);
            $('#country').text(response.data.country);
            },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

//$("#message-btn")