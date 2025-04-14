    $(document).ready(function() {
    let countdownTime = 30; // 30 seconds
    let countdown = setInterval(function() {
    countdownTime--;
    $("#countdown").text(countdownTime + "s");

    if (countdownTime <= 0) {
    clearInterval(countdown);
    $("#resend").removeClass("disabled"); // Enable the resend link
    $("#countdown").text(''); // Clear the countdown
}
}, 1000); // Runs every second
});

    // Store the OTP from server response
    let serverOTP;

    function sendOTP() {
        var email = document.getElementById('emaill').value;

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/password/sentOTP",
            contentType: "application/json",
            data: JSON.stringify({email: email}),
            dataType: "json",
            success: function (response) {
                console.log(response);
                // Store the OTP from the server response
                serverOTP = response;

                alert("OTP has been sent to " + email + ". Please check your inbox.");

                // Show OTP field and submit button
                document.getElementById('otpField').classList.remove('hidden');
                document.getElementById('submitOTP').classList.remove('hidden');

                // Hide send OTP button, show resend link with countdown
                $("#sentOTP").hide();
                $("#resend").show();
                $("#resend").addClass("disabled");

                // Start countdown for resend
                let countdownTime = 30;
                $("#countdown").text(countdownTime + "s");

                let countdown = setInterval(function() {
                    countdownTime--;
                    $("#countdown").text(countdownTime + "s");

                    if (countdownTime <= 0) {
                        clearInterval(countdown);
                        $("#resend").removeClass("disabled");
                        $("#countdown").text('');
                    }
                }, 1000);
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('Failed to send OTP. Please try again.');
            }
        });
    }

    function resendOTP() {
        // Only proceed if the resend button is not disabled
        if ($("#resend").hasClass("disabled")) {
            return;
        }

        var email = document.getElementById('emaill').value;

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/password/sentOTP",
            contentType: "application/json",
            data: JSON.stringify({email: email}),
            dataType: "json",
            success: function (response) {
                console.log(response);
                // Update stored OTP with new one from server
                serverOTP = response;

                // Restart countdown
                $("#resend").addClass("disabled");
                let countdownTime = 30;
                $("#countdown").text(countdownTime + "s");

                let countdown = setInterval(function() {
                    countdownTime--;
                    $("#countdown").text(countdownTime + "s");

                    if (countdownTime <= 0) {
                        clearInterval(countdown);
                        $("#resend").removeClass("disabled");
                        $("#countdown").text('');
                    }
                }, 1000);
            },
            error: function (xhr, status, error) {
                console.log(error);
                alert('Failed to resend OTP. Please try again.');
            }
        });
    }

    // Verify OTP
    document.getElementById('submitOTP').onclick = function(event) {
        event.preventDefault();
        var enteredOTP = document.getElementById('otp').value;

        if (!enteredOTP) {
            alert("Please enter the OTP.");
            return;
        }

        // Compare entered OTP with the one received from server
        if (enteredOTP == serverOTP) {
            // If OTP matches, proceed to password reset
            document.getElementById('newPassword').classList.remove('hidden');
            document.getElementById('submitPass').classList.remove('hidden');
            document.getElementById('otpField').classList.add('hidden');
            document.getElementById('resend').classList.add('hidden');
            document.getElementById('submitOTP').classList.add('hidden');
            $("#resend").hide();


            alert("OTP Verified. Please set your new password.");
        } else {
            alert("Invalid OTP. Please try again.");
        }
    }

    // Reset password
    $("#submitPass").on("click", function(event) {
        event.preventDefault();

        var password = $("#password").val();

        if (!password) {
            alert("Please enter a new password.");
            return;
        }

        var data = {
            email: $("#emaill").val(),
            password: password
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/password/resetPassword",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: function(response) {
                console.log(response);
                alert("Password has been reset successfully. You can now login with your new password.");
                closePopup(); // Close the forgot password modal
            },
            error: function(xhr, status, error) {
                console.log(error);
                alert('Failed to reset password. Please try again.');
            }
        });
    });


    // Open the login modal
    function openModal() {
    document.getElementById("loginModal").style.display = "block";
}

    // Close the login modal
    function closeModal() {
    document.getElementById("loginModal").style.display = "none";
}

    // Open the registration modal
    function openRegModal() {
    document.getElementById("registrationModal").style.display = "block";
}

    // Close the registration modal
    function closeRegModal() {
    document.getElementById("registrationModal").style.display = "none";
}

    // Close the modals when clicking outside the content
    window.onclick = function(event) {
    if (event.target == document.getElementById("loginModal")) {
    closeModal();
}
    if (event.target == document.getElementById("registrationModal")) {
    closeRegModal();
}
    if(event.target == document.getElementById("forget")) {
    closePopup();
}
}

    function closePopup() {
    document.getElementById("forget").style.display = "none";
}

    function openForgetModal() {
    closeModal()
    document.getElementById("forget").style.display = "block";
}

    $("#loginBtn").on("click", function(event) {
    var data = {
        email: $("#loginEmail").val(),
        password: $("#loginPassword").val()
    };

    console.log(data);

    if (data.email && data.password) {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/auth/authenticate",
            contentType: "application/json",
            data:  JSON.stringify(data),
            dataType: "json",

            success: function(response) {
                checkLoginStatus();
                console.log(response);
                if (response.message === "Success") {
                    console.log('log una')
                    localStorage.clear();
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("email", response.data.email);
                    if (response.data.role === "user") {
                        $("#loginIcon").css("display", "none");
                        closeModal();// Correct way to hide the element in jQuery
                    }

                    if (response.data.role === "admin") {
                        console.log('log admin');
                        $("#loginIcon").css("display", "none");  // Correct way to hide the element in jQuery
                        window.location.href = "admindash.html";  // Redirect to admin dashboard
                    }
                    // Login successful, redirect to the dashboard
                    //window.location.href = "admindash.html";
                } else {
                    // Login failed, show error message
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    }
})

    $("#registerBtn").on("click", function(event) {
        var data = {
            firstName: $("#first_name").val(),
            lastName: $("#last_name").val(),
            country: $("#country").val(),
            email: $("#reg_email").val(),
            password: $("#reg_password").val(),
            role: "user"
        };

        console.log(data);

        if (data.email && data.password) {
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/api/v1/user/register",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "json",

                success: function(response) {
                    console.log(response);
                    checkLoginStatus();
                    localStorage.clear();
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("email", response.data.email);

                    console.log(response);  // Check response content here
                    if (response.message === "Success") {
                        console.log('reg una');
                        checkLoginStatus();
                    closeRegModal(); // Hide the login icon if success
                        alert("Registration successful!");
                    } else {
                        alert(response.message);  // Show error message if not successful
                    }
                },
                error: function(xhr, status, error) {
                    console.log("Error: " + error);
                    alert(error)
                }
            });
        } else {
            alert("Please fill in all required fields.");
        }
    });

$("#testOne").on("click", function(event) {
    /*console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("email"));
    console.log(localStorage.getItem("role"));
    checkLoginStatus();*/
/*
    $("#loginIcon").css("display", "none");  // Hide the login icon if success
*/
    $(".join-btn").attr("disabled", true);
    $(".join-btn").css("cursor", "not-allowed");
})

    function checkLoginStatus() {
    var token = localStorage.getItem("token");
    if (token) {
        $(".join-btn").attr("disabled", true);
        $(".join-btn").css("cursor", "not-allowed");
        $("#loginIcon").css("display", "none");
       // Hide the login icon if success
    }
}

    $(document).ready(function(){
    // Add smooth scrolling to all links
    $(".fixed-side-navbar a, .primary-button a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});
