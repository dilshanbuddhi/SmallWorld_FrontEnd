$(document).ready(function() {
    // Preview images when selected in add form
    $('#hotelImages').change(function() {
        const fileInput = this;
        const previewContainer = $('#imagePreviewContainer');
        previewContainer.empty();

        if (fileInput.files && fileInput.files.length > 0) {
            const previewWrapper = $('<div class="d-flex flex-wrap mt-2"></div>');

            for (let i = 0; i < Math.min(fileInput.files.length, 5); i++) {
                const file = fileInput.files[i];
                if (file.type.match('image.*')) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        const img = $('<img class="image-preview">').attr('src', e.target.result);
                        previewWrapper.append(img);
                    };

                    reader.readAsDataURL(file);
                }
            }

            // Add a badge if there are more than 5 images
            if (fileInput.files.length > 5) {
                previewWrapper.append('<span class="badge bg-info mt-3">+' + (fileInput.files.length - 5) + ' more</span>');
            }

            previewContainer.append(previewWrapper);
        }
    });

    // Add custom amenity in add form
    $('#addAmenityBtn').click(function() {
        const amenityValue = $('#newAmenity').val().trim();
        if (amenityValue) {
            const amenityItem = $('<div class="amenity-item"></div>');
            const id = 'amenity-' + Date.now();

            amenityItem.html(`
                <input type="checkbox" class="form-check-input" id="${id}" name="amenities" value="${amenityValue}" checked>
                <label class="form-check-label ms-2" for="${id}">${amenityValue}</label>
                <button type="button" class="btn btn-sm text-danger ms-2 remove-amenity">×</button>
            `);

            $('#amenitiesContainer').append(amenityItem);
            $('#newAmenity').val('');
        }
    });

    // Add custom amenity in edit form
    $('#editAddAmenityBtn').click(function() {
        const amenityValue = $('#editNewAmenity').val().trim();
        if (amenityValue) {
            const amenityItem = $('<div class="amenity-item"></div>');
            const id = 'edit-amenity-' + Date.now();

            amenityItem.html(`
                <input type="checkbox" class="form-check-input" id="${id}" name="amenities" value="${amenityValue}" checked>
                <label class="form-check-label ms-2" for="${id}">${amenityValue}</label>
                <button type="button" class="btn btn-sm text-danger ms-2 remove-amenity">×</button>
            `);

            $('#editAmenitiesContainer').append(amenityItem);
            $('#editNewAmenity').val('');
        }
    });

    // Remove custom amenity
    $(document).on('click', '.remove-amenity', function() {
        $(this).closest('.amenity-item').remove();
    });

    // Handle edit button click
    $(document).on('click', '.edit-btn', function() {
        const hotelId = $(this).data('id');
        $('#editHotelId').val(hotelId);

        // Get the current row data
        const row = $(this).closest('tr');

        // Extract data from table cells
        const name = row.find('td:eq(1)').text();
        const city = row.find('td:eq(2)').text();
        const location = row.find('td:eq(3)').text();
        const description = row.find('td:eq(4)').text();
        const amenitiesText = row.find('td:eq(5)').text();

        // Populate form fields with the data from the table
        $('#editHotelName').val(name);
        $('#editCity').val(city);
        $('#editLocation').val(location);
        $('#editDescription').val(description);

        $('input[name="amenities"]').prop('checked', false);

        // Parse the amenities from the table
        const amenitiesList = amenitiesText.split(', ');
        amenitiesList.forEach(amenity => {
            // Check if there's an existing checkbox for this amenity
            const existingCheckbox = $(`input[name="amenities"][value="${amenity.trim()}"]`);

            if (existingCheckbox.length) {
                // If checkbox exists, check it
                existingCheckbox.prop('checked', true);
            } else {
                // If not, create a new one (custom amenity)
                const amenityItem = $('<div class="amenity-item"></div>');
                const id = 'edit-amenity-' + Date.now() + '-' + amenity.trim().replace(/\s+/g, '-');

                amenityItem.html(`
                <input type="checkbox" class="form-check-input" id="${id}" name="amenities" value="${amenity.trim()}" checked>
                <label class="form-check-label ms-2" for="${id}">${amenity.trim()}</label>
                <button type="button" class="btn btn-sm text-danger ms-2 remove-amenity">×</button>
            `);

                $('#editAmenitiesContainer').append(amenityItem);
            }
        });


    });

    // Handle delete button click
    $(document).on('click', '.delete-btn', function() {
        const hotelId = $(this).data('id');
        $('#deleteHotelId').val(hotelId);
        console.log(hotelId);
    });

    // Form submission handlers
    $('#addHotelForm').submit(async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const imageFiles = $('#hotelImages')[0].files;

        const hotelData = {
            name: formData.get('name'),
            city: formData.get('city'),
            description: formData.get('description'),
            location: formData.get('location'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            amenities: Array.from(formData.getAll('amenities')),
            image: [] // to be filled later
        };

        // Helper function to upload one image and return a promise
        function uploadImage(file) {
            return new Promise((resolve, reject) => {
                let imageFormData = new FormData();
                imageFormData.append('file', file);
                imageFormData.append('upload_preset', 'smallworld');
                imageFormData.append('cloud_name', 'dtvizkvur');

                $.ajax({
                    url: 'https://api.cloudinary.com/v1_1/dtvizkvur/image/upload',
                    type: 'POST',
                    data: imageFormData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        resolve(response.url); // Only get the image URL
                    },
                    error: function(xhr, status, error) {
                        reject(error);
                    }
                });
            });
        }

        try {
            // Wait for all image uploads to complete
            const uploadUrls = await Promise.all(
                Array.from(imageFiles).map(file => uploadImage(file))
            );

            hotelData.image = uploadUrls; // Now all URLs are ready

            // Send hotel data to backend
            $.ajax({
                url: 'http://localhost:8080/api/v1/hotel/save',
                type: 'POST',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
                contentType: 'application/json',
                data: JSON.stringify(hotelData),
                success: function(response) {
                    console.log('Hotel saved:', response);

                    Swal.fire({
                        title: 'Success!',
                        text: 'Hotel has been added successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        $('#addHotelModal').modal('hide');
                        $('#addHotelForm')[0].reset();
                        $('#imagePreviewContainer').empty();
                        getallhotel(); // refresh table
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    Swal.fire('Error!', 'Failed to save hotel.', 'error');
                }
            });

        } catch (err) {
            console.error('Image upload failed:', err);
            Swal.fire('Error!', 'Image upload failed.', 'error');
        }
    });

    // Edit hotel form submission handler
    $('#editHotelForm').submit(function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const hotelId = $('#editHotelId').val();

        const hotelData = {
            id: hotelId,
            name: $('#editHotelName').val(),
            city: $('#editCity').val(),
            description: $('#editDescription').val(),
            location: $('#editLocation').val(),
            latitude: $('#editLatitude').val(),
            longitude: $('#editLongitude').val(),
            amenities: Array.from(formData.getAll('amenities'))
        };

        $.ajax({
            url: 'http://localhost:8080/api/v1/hotel/update',
            type: 'PUT',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(hotelData),
            success: function(response) {
                console.log('Hotel updated:', response);

                Swal.fire({
                    title: 'Success!',
                    text: 'Hotel has been updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    $('#editHotelModal').modal('hide');
                    getallhotel(); // refresh table
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                Swal.fire('Error!', 'Failed to update hotel.', 'error');
            }
        });
    });

    // Delete hotel form submission handler
    $('#deleteHotelForm').submit(function(e) {
        e.preventDefault();

        const hotelId = $('#deleteHotelId').val();

        $.ajax({
            url: 'http://localhost:8080/api/v1/hotel/delete/' + hotelId,
            type: 'DELETE',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function(response) {
                console.log('Hotel deleted:', response);

                Swal.fire({
                    title: 'Success!',
                    text: 'Hotel has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    $('#deleteHotelModal').modal('hide');
                    getallhotel(); // refresh table
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                Swal.fire('Error!', 'Failed to delete hotel.', 'error');
            }
        });
    });

    // Load all hotels on page load
    getallhotel();

    function getallhotel() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/hotel/getAll',
            type: 'GET',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function(response) {
                console.log(response);
                var tableBody = $('#hotelTableBody');
                tableBody.empty();

                if (response.code === 200 && response.data) {
                    response.data.forEach(function(hotel) {
                        let amenitiesList = hotel.amenities.join(', ');
                        let firstImage = hotel.image.length > 0 ? hotel.image[0] : '/api/placeholder/50/50';
                        let moreImagesCount = hotel.image.length - 1;

                        let imagesHtml = `
                            <img src="${firstImage}" alt="Hotel thumbnail" class="img-thumbnail" style="width: 50px">
                            ${moreImagesCount > 0 ? `<span class="badge bg-info">+${moreImagesCount} more</span>` : ''}
                        `;

                        let row = `
                            <tr>
                                <td>${hotel.id}</td>
                                <td>${hotel.name}</td>
                                <td>${hotel.city}</td>
                                <td>${hotel.location}</td>
                                <td>${hotel.description}</td>
                                <td><small>${amenitiesList}</small></td>
                                <td>${imagesHtml}</td>
                                <td>
                                    <button class="btn btn-sm btn-success edit-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editHotelModal"
                                            data-id="${hotel.id}">
                                        <i class="bi bi-pencil"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-danger delete-btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteHotelModal"
                                            data-id="${hotel.id}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        `;
                        tableBody.append(row);
                    });
                } else {
                    tableBody.append('<tr><td colspan="8" class="text-center">No hotel data found.</td></tr>');
                }
            },
            error: function(error) {
                console.error("Error fetching hotels:", error);
                $('#hotelTableBody').append('<tr><td colspan="8" class="text-center text-danger">Failed to load hotel data.</td></tr>');
            }
        });
    }
});