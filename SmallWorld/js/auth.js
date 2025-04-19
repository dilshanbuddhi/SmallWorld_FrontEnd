// Initial check on page load
$(document).ready(function() {
    // Initialize UI based on login status
    initializeUI();

    // Handle countdown for OTP
    initializeOTPCountdown();

    // Set up smooth scrolling
    setupSmoothScrolling();
});

function initializeUI() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log(role , "  bgggg" , token);

    if (token && role) {
        // User is logged in
        $("#loginIcon").css("display", "none");
        $(".join-btn").attr("disabled", true);
        $(".join-btn").css("cursor", "not-allowed");

        // Check if we're on the wrong page for this role
        const currentPage = window.location.pathname.split('/').pop();

        // Only redirect if we're on the wrong page
        if (role === "admin" && currentPage !== "admindash.html") {
            window.location.href = "admindash.html";
        } else if (role === "guide" && currentPage !== "guide.html") {
            // Uncomment when guide page is ready
            // window.location.href = "guide.html";
        }
    } else {
        // User is not logged in
        $("#loginIcon").css("display", "block");
        $(".join-btn").attr("disabled", false);
        $(".join-btn").css("cursor", "pointer");
    }
}

function initializeOTPCountdown() {
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
}

function setupSmoothScrolling() {
    // Add smooth scrolling to all links
    $(".fixed-side-navbar a, .primary-button a").on('click', function(event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                // Add hash (#) to URL when done scrolling
                window.location.hash = hash;
            });
        }
    });
}

// Store the OTP from server response
let serverOTP;

// Send OTP function
function sendOTP() {
    var email = $("#emaill").val();

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
        success: function(response) {
            console.log(response);
            // Store the OTP from the server response
            serverOTP = response;

            alert("OTP has been sent to " + email + ". Please check your inbox.");

            // Show OTP field and submit button
            $("#otpField").removeClass('hidden');
            $("#submitOTP").removeClass('hidden');

            // Hide send OTP button, show resend link with countdown
            $("#sentOTP").hide();
            $("#resend").show().addClass("disabled");

            // Start countdown for resend
            startResendCountdown();
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert('Failed to send OTP. Please try again.');
        }
    });
}

// Start or restart the resend countdown
function startResendCountdown() {
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
}

// Resend OTP function
function resendOTP() {
    // Only proceed if the resend button is not disabled
    if ($("#resend").hasClass("disabled")) {
        return;
    }

    var email = $("#emaill").val();

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/v1/password/sentOTP",
        contentType: "application/json",
        data: JSON.stringify({email: email}),
        dataType: "json",
        success: function(response) {
            console.log(response);
            // Update stored OTP with new one from server
            serverOTP = response;

            // Restart countdown
            $("#resend").addClass("disabled");
            startResendCountdown();

            alert("OTP has been resent to your email.");
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert('Failed to resend OTP. Please try again.');
        }
    });
}

// Verify OTP
$(document).on('click', '#submitOTP', function(event) {
    event.preventDefault();
    var enteredOTP = $("#otp").val();

    if (!enteredOTP) {
        alert("Please enter the OTP.");
        return;
    }

    // Compare entered OTP with the one received from server
    if (enteredOTP == serverOTP) {
        // If OTP matches, proceed to password reset
        $("#newPassword").removeClass('hidden');
        $("#submitPass").removeClass('hidden');
        $("#otpField").addClass('hidden');
        $("#resend").addClass('hidden');
        $("#submitOTP").addClass('hidden');
        $("#resend").hide();

        alert("OTP Verified. Please set your new password.");
    } else {
        alert("Invalid OTP. Please try again.");
    }
});

// Reset password
$(document).on('click', '#submitPass', function(event) {
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

// Login button click handler
$(document).on('click', '#loginBtn', function(event) {
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
            data: JSON.stringify(data),
            dataType: "json",
            success: function(response) {
                console.log(response);
                if (response.message === "Success") {
                    console.log('log success');
                    //localStorage.clear();
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("email", response.data.email);


                    // Update UI based on role
                    $("#loginIcon").css("display", "none");
                    $(".join-btn").attr("disabled", true);
                    $(".join-btn").css("cursor", "not-allowed");
                    closeModal();

                    // Handle redirects based on role
                    if (response.data.role === "admin") {
                        console.log('log admin');
                        window.location.href = "admindash.html";
                    } else if (response.data.role === "guide") {
                        // Uncomment when guide page is ready
                        // window.location.href = "guide.html";
                    }
                    // Regular users stay on current page
                } else {
                    // Login failed, show error message
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
                alert("Login failed. Please check your credentials.");
            }
        });
    } else {
        alert("Please enter both email and password.");
    }
});

// Register button click handler
$(document).on('click', '#registerBtn', function(event) {
    var data = {
        firstName: $("#first_name").val(),
        lastName: $("#last_name").val(),
        country: $("#country").val(),
        email: $("#reg_email").val(),
        password: $("#reg_password").val(),
        role: "user"
    };

    console.log(data);

    if (data.email && data.password && data.firstName && data.lastName) {
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/api/v1/user/register",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: function(response) {
                console.log(response);

                if (response.message === "Success") {
                    console.log('reg success');
                    localStorage.clear();
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("role", response.data.role);
                    localStorage.setItem("email", response.data.email);

                    // Update UI
                    $("#loginIcon").css("display", "none");
                    $(".join-btn").attr("disabled", true);
                    $(".join-btn").css("cursor", "not-allowed");
                    closeRegModal();

                    alert("Registration successful!");
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
                alert("Registration failed: " + error);
            }
        });
    } else {
        alert("Please fill in all required fields.");
    }
});

// Test button (for debugging)
$(document).on('click', '#testOne', function(event) {
    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("email"));
    console.log(localStorage.getItem("role"));

    $(".join-btn").attr("disabled", true);
    $(".join-btn").css("cursor", "not-allowed");
});

// Event handlers for buttons
$(document).on('click', '#sentOTP', function() {
    sendOTP();
});

$(document).on('click', '#resend', function() {
    resendOTP();
});

// Modal functions
function openModal() {
    document.getElementById("loginModal").style.display = "block";
}

function closeModal() {
    document.getElementById("loginModal").style.display = "none";
}

function openRegModal() {
    document.getElementById("registrationModal").style.display = "block";
}

function closeRegModal() {
    document.getElementById("registrationModal").style.display = "none";
}

function openForgetModal() {
    closeModal();
    document.getElementById("forget").style.display = "block";
}

function closePopup() {
    document.getElementById("forget").style.display = "none";
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
};