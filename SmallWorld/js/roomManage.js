    // File input preview for Add Room Modal
    document.getElementById('roomImages').addEventListener('change', function(event) {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    imagePreviewContainer.innerHTML = '';

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.match('image.*')) {
    const reader = new FileReader();
    reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.classList.add('room-image-preview');
    imagePreviewContainer.appendChild(img);
};
    reader.readAsDataURL(file);
}
}
});

    // File input preview for Edit Room Modal
    document.getElementById('editRoomImages').addEventListener('change', function(event) {
    const imagePreviewContainer = document.getElementById('editImagePreviewContainer');
    imagePreviewContainer.innerHTML = '';

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.match('image.*')) {

    const reader = new FileReader();
    reader.onload = function(e) {
    const img = document.createElement('img');
    img.src = e.target.result;
    img.classList.add('room-image-preview');
    imagePreviewContainer.appendChild(img);
};
    reader.readAsDataURL(file);
}
}
});

    // Get the edit modal element
    const editRoomModal = document.getElementById('editRoomModal');

    // Add event listener to the modal when it is about to be shown
    editRoomModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;

    // Extract info from data-* attributes
    const roomId = button.getAttribute('data-id');
    const hotelId = button.getAttribute('data-hotel');
    const roomType = button.getAttribute('data-roomtype');
    const price = button.getAttribute('data-price');
    const totalRooms = button.getAttribute('data-totalrooms');
    const availableRooms = button.getAttribute('data-availablerooms');

    // Get the input fields in the modal
    const editRoomIdInput = document.getElementById('editRoomId');
    const editHotelIdSelect = document.getElementById('editHotelId');
    const editRoomTypeSelect = document.getElementById('editRoomType');
    const editPriceInput = document.getElementById('editPrice');
    const editTotalRoomsInput = document.getElementById('editTotalRooms');
    const editAvailableRoomsInput = document.getElementById('editAvailableRooms');

    // Update the modal's fields with the selected room data
    editRoomIdInput.value = roomId;
    editHotelIdSelect.value = hotelId;
    editRoomTypeSelect.value = roomType;
    editPriceInput.value = price;
    editTotalRoomsInput.value = totalRooms;
    editAvailableRoomsInput.value = availableRooms;
});

    // Get the delete modal element
    const deleteRoomModal = document.getElementById('deleteRoomModal');

    // Add event listener to the modal when it is about to be shown
    deleteRoomModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    const button = event.relatedTarget;

    // Extract room ID from data-id attribute
    const roomId = button.getAttribute('data-id');

    // Get the hidden input field in the delete form
    const deleteRoomIdInput = document.getElementById('deleteRoomId');

    // Set the room ID in the hidden input field
    deleteRoomIdInput.value = roomId;
});
    setHoteslst();
    setRoomtypelst();
    getAllRooms();

    function setHoteslst() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/hotel/getAll',
            type: 'GET',
            dataType: 'json',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function(response) {
            if (response.code === 200) {
                $('#hotelId').empty();
                let hotels = response.data;
                let html = '';
                for (let i = 0; i < hotels.length; i++) {
                html += '<option value="' + hotels[i].id + '">' + hotels[i].name + '</option>';
                }
                $('#hotelId').html(html);
            }
            }
        })
    }

    function setRoomtypelst() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/roomType/getAll',
            type: 'GET',
            dataType: 'json',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function(response) {
            if (response.code === 200) {
                $('#roomType').empty();
                let roomtypes = response.data;
                let html = '';
                for (let i = 0; i < roomtypes.length; i++) {
                html += '<option value="' + roomtypes[i].id + '">' + roomtypes[i].room_type + '</option>';
                }
                $('#roomType').html(html);
            }
            }
        })
    }

    $('#saveRoomBtn').on('click', function (e) {
        e.preventDefault(); // Prevent default form submission

        var formData1 = new FormData();
        formData1.append('hotel_id', $('#hotelId').val());
        formData1.append('room_type_Id', $('#roomType').val());
        formData1.append('price', $('#price').val());
        formData1.append('totalRooms', $('#totalRooms').val());
        formData1.append('availableRooms', $('#availableRooms').val());

        var imageFiles = $('#roomImages')[0].files;

        if (imageFiles.length === 0) {
            alert('Please select some images to upload.');
            return;
        }

        var uploadedUrls = [];

        for (var i = 0; i < imageFiles.length; i++) {
            var formData = new FormData();
            formData.append('file', imageFiles[i]);
            formData.append('upload_preset', 'smallworld'); // Replace with your actual preset
            formData.append('cloud_name', 'dtvizkvur'); // Replace with your actual Cloudinary cloud name

            $.ajax({
                url: 'https://api.cloudinary.com/v1_1/dtvizkvur/image/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    uploadedUrls.push(response.url);
                    console.log('Uploaded:', response.url);


                    // If all files uploaded
                    if (uploadedUrls.length === imageFiles.length) {
                        console.log('All images uploaded:', uploadedUrls);

                        // Prepare JSON object
                        const roomData = {
                            hotel_id: $('#hotelId').val(),
                            room_type_Id: $('#roomType').val(),
                            price: $('#price').val(),
                            totalRooms: $('#totalRooms').val(),
                            availableRooms: $('#availableRooms').val(),
                            images: uploadedUrls
                        };

                        $.ajax({
                            url: 'http://localhost:8080/api/v1/room/save',
                            type: 'POST',
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token")
                            },
                            contentType: 'application/json',
                            data: JSON.stringify(roomData),
                            success: function (response) {
                                getAllRooms();
                                uploadedUrls = [];
                                console.log('Room saved:', response);
                                $('#addRoomModal').modal('hide');
                            },
                            error: function (xhr, status, error) {
                                console.error('Save failed:', error);
                                alert('Failed to save room.');
                            }
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Image upload failed:', error);
                    alert('Image upload error!');
                }
            });
        }
    });

    function getAllRooms() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/room/getAll',
            type: 'GET',
            dataType: 'json',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function (response) {
                if (response.code === 200) {
                    const rooms = response.data;
                    const $roomBody = $('#roomBody');
                    $roomBody.empty(); // Clear existing table rows

                    rooms.forEach(room => {
                        const roomId = room.id;
                        const hotelName = room.hotel?.name || 'N/A';
                        const roomType = room.room_type?.room_type || 'N/A';
                        const price = room.price || '0';
                        const totalRooms = room.totalRooms || '0';
                        const availableRooms = room.availableRooms || '0';
                        const images = room.images || [];

                        // Generate image thumbnails
                        let thumbnailsHtml = '<div class="thumbnail-container">';
                        images.forEach(imgUrl => {
                            thumbnailsHtml += `<img src="${imgUrl}" alt="Room image" class="room-thumbnail" style="width: 120px; height: 80px; margin-right: 5px;">`;
                        });
                        thumbnailsHtml += '</div>';

                        // Generate row HTML
                        const rowHtml = `
                        <tr>
                            <td>${roomId}</td>
                            <td>${hotelName}</td>
                            <td>${roomType}</td>
                            <td>$${price}</td>
                            <td>${totalRooms}</td>
                            <td>${availableRooms}</td>
                            <td>${thumbnailsHtml}</td>
                            <td>
                                <button class="btn btn-sm btn-success"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editRoomModal"
                                        data-id="${roomId}"
                                        data-hotel="${room.hotel?.id}"
                                        data-roomtype="${room.room_type?.id}"
                                        data-price="${price}"
                                        data-totalrooms="${totalRooms}"
                                        data-availablerooms="${availableRooms}">
                                    <i class="bi bi-pencil"></i> Edit
                                </button>
                                <button class="btn btn-sm btn-danger"
                                        data-bs-toggle="modal"
                                        data-bs-target="#deleteRoomModal"
                                        data-id="${roomId}">
                                    <i class="bi bi-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;

                        $roomBody.append(rowHtml);
                    });
                } else {
                    alert("Failed to load rooms: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error loading rooms:", error);
                alert("Something went wrong while loading the rooms.");
            }
        });
    }


