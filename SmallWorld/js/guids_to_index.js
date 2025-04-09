// Function to get all guides
function getAllguids() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/guid/getAll',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: 'json',
        success: function (response) {
            console.log(response);

            $("#guid-set").empty();

            for (let i = 0; i < response.data.length; i++) {
                let guid = response.data[i];

                // Build languages list
                let languagesHTML = '';
                guid.languages.forEach(function(language) {
                    languagesHTML += `<span class="language-tag">${language}</span>`;
                });

                // Create certifications badges if available
                let certificationsHTML = '';
                if (guid.certifications && guid.certifications.length > 0) {
                    guid.certifications.forEach(function(cert) {
                        certificationsHTML += `<span class="expertise-tag">${cert}</span>`;
                    });
                } else {
                    certificationsHTML = `
                        <span class="expertise-tag">History</span>
                        <span class="expertise-tag">Culture</span>
                        <span class="expertise-tag">Food</span>
                    `;
                }

                $("#guid-set").append(`
                    <div class="col-md-6">
                        <div class="guide-card">
                            <div class="guide-img">
                                <img src="${guid.profile_image}" alt="Tour Guide">
                                <div class="experience-badge">${guid.experience_of_years}+ Years Experience</div>
                                <div class="guide-verified">Verified</div>
                            </div>
                            <div class="guide-info">
                                <h5 class="guide-name">${guid.name}</h5>
                                <p class="guide-location"><i class="fas fa-map-marker-alt"></i> ${guid.address}</p>
                                
                                <div class="guide-short-info">
                                    <div class="info-item"><i class="fas fa-users"></i> Groups up to 10</div>
                                    <div class="info-item"><i class="fas fa-check-circle"></i> 75 Tours</div>
                                </div>
                                
                                <div class="guide-languages">
                                    ${languagesHTML}
                                </div>
                                
                                <div class="guide-expertise">
                                    ${certificationsHTML}
                                </div>
                                
                                <div class="guide-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span class="text-muted ml-1">(42 reviews)</span>
                                </div>
                                
                                <div class="guide-price">
                                    From ${guid.price}LKR per day
                                </div>
                                
                                <div class="guide-availability">
                                    <i class="fas fa-calendar-check"></i> ${guid.availability === "available" ? "Available this week" : "Currently unavailable"}
                                </div>
                                
                                <div class="d-flex justify-content-between">
                                    <a href="#" class="outline-btn view-profile" 
                                        data-guide-id="${guid.id}"
                                        data-guide-name="${guid.name}"
                                        data-guide-image="${guid.profile_image}"
                                        data-guide-years="${guid.experience_of_years}"
                                        data-guide-address="${guid.address}"
                                        data-guide-about="${guid.about_me}"
                                        data-guide-price="${guid.price}"
                                        data-guide-availability="${guid.availability}">View Profile</a>
                                    <a href="#" class="primary-btn contact-guide" 
                                       data-guide-id="${guid.id}" 
                                       data-guide-name="${guid.name}" 
                                       data-guide-email="${guid.email}" 
                                       data-guide-phone="${guid.phone_number}"
                                       data-guide-price="${guid.price}">Contact</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            }

            // Add event listener for profile buttons
            $(".view-profile").click(function(e) {
                e.preventDefault();

                // Get guide data from data attributes
                const guideId = $(this).data('guide-id');
                const guideName = $(this).data('guide-name');
                const guideImage = $(this).data('guide-image');
                const guideYears = $(this).data('guide-years');
                const guideAddress = $(this).data('guide-address');
                const guideAbout = $(this).data('guide-about');
                const guidePrice = $(this).data('guide-price');
                const guideAvailability = $(this).data('guide-availability');

                // Get guide object from response data for languages and certifications
                const guide = response.data.find(g => g.guidID === guideId);

                // Build languages HTML for profile modal
                let profileLanguagesHTML = '';
                guide.languages.forEach(function(language) {
                    profileLanguagesHTML += `<span class="language-tag">${language}</span>`;
                });

                // Build certifications HTML for profile modal
                let profileCertificationsHTML = '';
                if (guide.certifications && guide.certifications.length > 0) {
                    guide.certifications.forEach(function(cert) {
                        profileCertificationsHTML += `<p><i class="fas fa-certificate text-warning mr-2"></i> ${cert}</p>`;
                    });
                } else {
                    profileCertificationsHTML = `
                        <p><i class="fas fa-certificate text-warning mr-2"></i> Certified Tour Guide</p>
                        <p><i class="fas fa-certificate text-warning mr-2"></i> First Aid Certified</p>
                    `;
                }

                // Update modal with guide details
                $("#guideProfileModal .modal-title").text(`${guideName}'s Profile`);
                $("#guideProfileModal .profile-image").attr("src", guideImage);
                $("#guideProfileModal .profile-name").text(guideName);
                $("#guideProfileModal .profile-experience").text(`Professional Tour Guide • ${guideYears}+ Years Experience`);
                $("#guideProfileModal .profile-address").text(guideAddress);
                $("#guideProfileModal .profile-availability").text(guideAvailability === "available" ? "Available this week" : "Currently unavailable");
                $("#guideProfileModal .profile-about").text(guideAbout || "Passionate about sharing the beauty and culture of Sri Lanka with visitors from around the world.");
                $("#guideProfileModal .profile-certifications").html(profileCertificationsHTML);
                $("#guideProfileModal .profile-languages").html(profileLanguagesHTML);
                $("#guideProfileModal .profile-rate").text(`${guidePrice}LKR per day`);

                // Store guide ID in contact button
                $("#guideProfileModal .contact-guide-btn").data('guide-id', guideId);
                $("#guideProfileModal .contact-guide-btn").data('guide-name', guideName);

                // Show the modal
                $("#guideProfileModal").modal('show');
            });

            // Add event listener for contact buttons in cards
            $(".contact-guide").click(function(e) {
                e.preventDefault();

                // Get guide data from data attributes
                const guideId = $(this).data('guide-id');
                const guideName = $(this).data('guide-name');
                const guideEmail = $(this).data('guide-email');
                const guidePhone = $(this).data('guide-phone');
                const guidePrice = $(this).data('guide-price');

                // Set modal title with guide name
                $("#contactGuideModal .modal-title").text(`Contact ${guideName}`);

                // Store guide ID in the form for submission
                $("#contactGuideModal form").data('guide-id', guideId);

                // Pre-fill guide info in the modal
                $("#guide-details").html(`
                    <p><strong>Guide:</strong> ${guideName}</p>
                    <p><strong>Contact:</strong> ${guidePhone}</p>
                    <p><strong>Rate:</strong> ${guidePrice}LKR per day</p>
                `);

                // Show the modal
                $("#contactGuideModal").modal('show');
            });

            // Add event listener for contact button in profile modal
            $("#guideProfileModal .contact-guide-btn").click(function() {
                // Get guide data from button
                const guideId = $(this).data('guide-id');
                const guideName = $(this).data('guide-name');

                // Close profile modal
                $("#guideProfileModal").modal('hide');

                // Find the guide in the data
                const guide = response.data.find(g => g.guidID === guideId);

                // Set contact modal with guide info
                $("#contactGuideModal .modal-title").text(`Contact ${guideName}`);
                $("#contactGuideModal form").data('guide-id', guideId);
                $("#guide-details").html(`
                    <p><strong>Guide:</strong> ${guideName}</p>
                    <p><strong>Contact:</strong> ${guide.phone_number}</p>
                    <p><strong>Rate:</strong> ${guide.price}LKR per day</p>
                `);

                // Show contact modal
                setTimeout(function() {
                    $("#contactGuideModal").modal('show');
                }, 500);
            });
        }
    });
}

// Handle form submission for contact modal
$("#send-request-btn").click(function() {
    const guideId = $("#contactGuideModal form").data('guide-id');
    const name = $("#contact-name").val();
    const email = $("#contact-email").val();
    const phone = $("#contact-phone").val();
    const date = $("#tour-date").val();
    const language = $("#language").val();
    const groupSize = $("#group-size-contact").val();
    const duration = $("#tour-duration").val();
    const message = $("#smessage").val();
    const title = $("#title").val();

    // Validate form
    if (!name || !email || !phone || !date || !message) {
        alert("Please fill all required fields");
        return;
    }

    // Create request object
    const requestData = {
        guideId: guideId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        tourDate: date,
        groupSize: groupSize,
        tourDuration: duration,
        message: message,
        language : language,
        status : "pending",
        title: title
    };

    console.log(requestData);

    // Send request to backend (example)
    $.ajax({
        url: 'http://localhost:8080/api/v1/tourRequest/create',
        type: 'POST',
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzNjU3MTQ0LCJleHAiOjE3NDQ2OTM5NDR9.99NbKqcpInWUohv_89_49cAcke4AOcKjaEI0xw4NDnkc_ZFEgoCKkhS8lFgMIkT07gmfNBEWo2ht1POwtrJwJg"
        },
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(response) {
            console.log(response);
            // Close modal and show success message
            $("#contactGuideModal").modal('hide');
            alert("Your request has been sent successfully!");

            // Reset form
            $("#contactGuideModal form")[0].reset();
        },
        error: function(error) {
            alert("There was an error sending your request. Please try again.");
            console.error(error);
        }
    });
});

// Call function to load guides on page load
$(document).ready(function() {
    getAllguids();
});