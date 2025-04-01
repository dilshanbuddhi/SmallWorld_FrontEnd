getPlaces();

function getPlaces() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/place/getAll',
        method: 'GET',
        dataType: 'json',

        success: function (data) {
            console.log(data);
            if (data.code === 200 && data.data) {
                $("#places").empty();
                $("#places").append(
                    ` <div class="col-12 mb-3">
                            <h4>Popular Destinations</h4>
                            <div class="line-dec"></div>
                        </div>`
                );
                for (let i = 0; i < data.data.length; i++) {
                    let place = data.data[i];
                    $("#places").append(`
                                                    <div class="col-md-6">
                                <div class="popular-place">
                                    <div class="place-img">
                                        <img src="${place.image[0]}" alt="Beach destination">
                                        <span class="place-tag">${place.category.name} </span>
                                    </div>
                                    <div class="place-info">
                                        <h5 class="place-title">${place.name} </h5>
                                        <p class="place-location"><i class="fas fa-map-marker-alt"></i> ${place.location}</p>
                                        <div class="weather-info">
                                            <i class="fas fa-sun"></i> 32°C Sunny
                                        </div>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="rating">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="far fa-star"></i>
                                                <span class="text-muted ml-1">(128)</span>
                                            </div>
                                            <a href="placeDetail.html?id=${place.id}&city=${place.city}" class="outline-btn">View Details</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    `);
                }
            }
        },
        error: function (err) {
            console.error(err);
        }
    })


}