getAll();
setcategories();

function setcategories() {
    // Fetch categories from the API
    $.ajax({
        url: 'http://localhost:8080/api/v1/placeCategory/getAll',
        type: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
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
            Authorization: "Bearer " + localStorage.getItem("token")
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
        var formData1 = new FormData();
        formData1.append('name', $('#placename').val());
        formData1.append('categoryID', $('#category').val());
        formData1.append('description', $('#placedesc').val());
        formData1.append('location', $('#placelocation').val());
        formData1.append('latitude', $('#latitude').val());
        formData1.append('longitude', $('#longitude').val());
        formData1.append('city' , $('#city').val());


        var imageFiles = $('#placeimages')[0].files; // Use 'files' to get the FileList object

        if (imageFiles.length === 0) {
            alert('Please select some images to upload.');
            return;
        }

        var uploadedUrls = []; // Array to store the uploaded image URLs

        // Loop through the files and upload each one
        for (var i = 0; i < imageFiles.length; i++) {
            var formData = new FormData();
            formData.append('file', imageFiles[i]); // Append each file individually
            formData.append('upload_preset', 'smallworld'); // Replace with your actual preset
            formData.append('cloud_name', 'dtvizkvur'); // Replace with your Cloudinary cloud name

            // Make the AJAX request to Cloudinary's API
            $.ajax({
                url: 'https://api.cloudinary.com/v1_1/dtvizkvur/image/upload', // Replace with your Cloudinary cloud name
                type: 'POST',
                data: formData,
                processData: false, // Stop jQuery from processing the data
                contentType: false, // Prevent jQuery from setting contentType
                success: function(response) {
                    console.log(response.url)
                    // Store the uploaded URL
                    uploadedUrls.push(response.url);
                    console.log('Uploaded Successfully:', response.url);

                    // If all files have been processed
                    if (uploadedUrls.length === imageFiles.length) {
                        console.log('All images uploaded:', uploadedUrls);
                        formData1.append('imageFiles', uploadedUrls);
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/place/save',
                            type: 'POST',
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            },
                            data: formData1,
                            processData: false, // Important to prevent jQuery from processing the data
                            contentType: false, // Important to allow FormData to be sent correctly
                            success: function(response) {
                                console.log('Success:', response);
                                // Handle success (e.g., show a success message or close modal)
                                uploadedUrls = [];
                                //alert('Place added successfully!');
                                $('#addPlaceModal').modal('hide');
                                getAll();// Hide the modal after submission
                            },
                            error: function(xhr, status, error) {
                                console.error('Error:', error);
                                // Handle error (e.g., show an error message)
                                alert('There was an error adding the place.');
                            }
                        });

                    }
                },
                error: function(xhr, status, error) {
                    console.error('Upload Failed:', error);
                    alert('There was an error uploading one of the images.');
                }
            });
        }


    });
});



