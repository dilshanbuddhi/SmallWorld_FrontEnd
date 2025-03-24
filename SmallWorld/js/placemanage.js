getAll();
setcategories();

function setcategories() {
    // Fetch categories from the API
    $.ajax({
        url: 'http://localhost:8080/api/v1/placeCategory/getAll',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        success: function(response) {
                // Populate the select dropdown with category options
                var categories = response.data;
                var categorySelect = $('#category');

                // Clear any existing options (optional)
                categorySelect.empty();

                // Add the default option
                categorySelect.append('<option value="" selected disabled>Select a Category</option>');

                // Add the category options dynamically
                $.each(categories, function(i, category) {
                    categorySelect.append('<option value="' + category.id + '">' + category.name + '</option>');
                });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching categories:', error);
            // Handle error (e.g., show an error message)
            alert('There was an error loading the categories.');
        }
    });
}

function getAll() {
    $.ajax({
        url: "http://localhost:8080/api/v1/place/getAll",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
            let rows = '';
            $("#placeBody").empty();
            for (let i = 0; i < response.data.length; i++) {
                let place = response.data[i];
                rows += `<tr>
                            <td>${place.id}</td>
                            <td>${place.name}</td>
                            <td>${place.category.name}</td>
                            <td>${place.description}</td>
                            <td>${place.location}</td>
                            <td>${place.longitude}</td>
                            <td>${place.latitude}</td>
                            <td><img src="${place.image[0]}" alt="${place.name}" width="50" height="50"></td>
                            <td>
                                <button id="edit-btn" class="btn btn-sm btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editPlaceModal"
                                        data-id="${place.id}"
                                        data-name="${place.name}"
                                        data-description="${place.description}"
                                        data-address="${place.location}"
                                        data-longitude="${place.longitude}"
                                        data-latitude="${place.latitude}"
                                        data-photo="${place.image[0]}">
                                    <i class="bi bi-pencil"></i> Edit
                                </button>
                                <button id="delete-btn" class="btn btn-sm btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deletePlaceModal"
                                        data-id="${place.id}">
                                    <i class="bi bi-trash"></i> Delete
                                </button>
                            </td>
                         </tr>`;
            }
            $("#placeBody").append(rows);
        },
        error: function (err) {
            console.error("Error fetching data:", err);
        }
    });
}


$(document).ready(function() {
    $('#savePlaceBtn').on('click', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Create FormData to append the form values
        var formData = new FormData();
        formData.append('name', $('#placename').val());
        formData.append('categoryID', $('#category').val());
        formData.append('description', $('#placedesc').val());
        formData.append('location', $('#placelocation').val());
        formData.append('latitude', $('#latitude').val());
        formData.append('longitude', $('#longitude').val());

        // Get image files and append them
        var imageFiles = $('#placeimages')[0].files;
        $.each(imageFiles, function(i, file) {
            formData.append('imageFiles', file);
        });

        // Send the data using jQuery's Ajax
        $.ajax({
            url: 'http://localhost:8080/api/v1/place/save',
            type: 'POST',
            headers: {
                Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
            },
            data: formData,
            processData: false, // Important to prevent jQuery from processing the data
            contentType: false, // Important to allow FormData to be sent correctly
            success: function(response) {
                console.log('Success:', response);
                // Handle success (e.g., show a success message or close modal)
                alert('Place added successfully!');
                $('#addPlaceModal').modal('hide');
                getAll();// Hide the modal after submission
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                // Handle error (e.g., show an error message)
                alert('There was an error adding the place.');
            }
        });
    });
});



