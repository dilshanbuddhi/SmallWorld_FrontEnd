getAllguids();

function getAllguids() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/guid/getAll',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJzdWIiOiJkaWxhZGlsYUBnbWFpbC5jb20iLCJpYXQiOjE3NDMzMTcyNzAsImV4cCI6MTc0NDM1NDA3MH0.nrqqk18uz5GLLfSZ_eHzHhQWXCLCyiKj-BbrNU6_FNqyyyqYRMLGVwGVqeVrRPN2gyeQpOjY8-QZr1XK2uviZA"
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
                                    <span class="expertise-tag">History</span>
                                    <span class="expertise-tag">Culture</span>
                                    <span class="expertise-tag">Food</span>
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
                                    <i class="fas fa-calendar-check"></i> Available this week
                                </div>

                                <div class="d-flex justify-content-between">
                                    <a href="#" class="outline-btn view-profile" data-guide="saman">View Profile</a>
                                    <a href="#" class="primary-btn contact-guide" data-guide="saman">Contact</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            }
        }
    });
}
