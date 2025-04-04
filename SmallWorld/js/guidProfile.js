function getGuidData() {
    $.ajax({
        url: "http://localhost:8080/api/v1/guid/profile",
        method: "GET",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: "json",
        success: function (response) {
            if (response.code === 200) {
                let data = response.data;

                // Update profile details
                $("#name").text(data.name);
                $("#email").text(data.email);
                $("#number").text(data.phone_number);
                $("#location").text(data.address);
                $("#about").text(data.about_me);
                $("#years-of-experience").text(data.years_experience);

                // Update profile image
                $(".avatar img").attr("src", data.profile_image);


                // Update languages
                let languagesHtml = "";
                $("#languages").empty();
                data.languages.forEach(lang => {
                    languagesHtml += `<span class="tag">${lang}</span>`;
                });
                $("#languages").html(languagesHtml);
              /*  data.languages.forEach(lang => {
                    languagesHtml += `<span class="tag">${lang}</span>`;
                });
                $("#languages").html(languagesHtml);

                // Update specialization (if available in the API response)
                if (data.certifications) {
                    let specializationsHtml = "";
                    data.certifications.forEach(cert => {
                        specializationsHtml += `<span class="tag">${cert}</span>`;
                    });
                    $(".detail-value").html(specializationsHtml);
                }

                // Update price and availability (if needed)
                if (data.price) {
                    $(".price").text(`Price: ${data.price} LKR`);
                }
                if (data.availability) {
                    $(".availability").text(`Status: ${data.availability}`);
                }*/
            }
        },
        error: function (error) {
            console.log("Error fetching guide data:", error);
        }
    });
}

// Call the function when the page loads
$(document).ready(function () {
    getGuidData();
});
