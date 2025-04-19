getLiveUserDetail();

function getLiveUserDetail() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/profile',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        dataType: 'json',
        success: function (response) {
            localStorage.setItem("userid" , response.data.uid);
            console.log(response);

            // Extract data
            const user = response.data;
            if (user.role === "user"){
                console.log("sss");
            }else {
                $("#guid").css("display", "none");
            }
            const fullName = `${capitalize(user.firstName)} ${capitalize(user.lastName)}`;

            // Set profile details
            $('#email').text(user.email);
            $('#country').text(user.country);
            $('.profile-picture h3').text(fullName);
            $('#massage').text(user.role); // if this is not a message, rename the ID to #role or #user-role
        },
        error: function (xhr, status, error) {
            console.log("Error fetching user profile:", error);
        }
    });
}

// Helper to capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
$(".add-link").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "index.html"; // or wherever your login page is
});

$("#guidbtn").click(function (e) {
    e.preventDefault();
    /*localStorage.removeItem("token");
    localStorage.removeItem("role");*/
    window.location.href = "createGuidProfile.html"; // or wherever your login page is
});

