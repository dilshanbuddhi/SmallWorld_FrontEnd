// Room Type Management JavaScript

// Initialize amenities array for add modal
let amenitiesArray = [];
// Initialize amenities array for edit modal
let editAmenitiesArray = [];

// Load all room types when the page loads
$(document).ready(function() {
    getRoomtype();

    // Handle Add Amenity button click in Add modal
    $("#addAmenityBtn").click(function() {
        addAmenity();
    });

    // Also allow Enter key to add amenity
    $("#roomTypeAmenities").keypress(function(e) {
        if(e.which === 13) {
            e.preventDefault();
            addAmenity();
        }
    });

    // Handle Add Amenity button click in Edit modal
    $("#editAddAmenityBtn").click(function() {
        addEditAmenity();
    });

    // Also allow Enter key to add amenity in Edit modal
    $("#editRoomTypeAmenities").keypress(function(e) {
        if(e.which === 13) {
            e.preventDefault();
            addEditAmenity();
        }
    });

    // Save new room type
    $("#saveRoomTypeBtn").click(function() {
        saveRoomType();
    });

    // Update room type
    $("#updateRoomTypeBtn").click(function() {
        updateRoomType();
    });

    // Delete room type
    $("#deleteRoomTypeBtn").click(function() {
        deleteRoomType();
    });

    // Set up event delegation for edit buttons
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const roomType = $(this).data('room-type');
        const description = $(this).data('description');
        const amenities = $(this).data('amenities');

        // Set values in edit modal
        $("#editRoomTypeId").val(id);
        $("#editRoomTypeName").val(roomType);
        $("#editRoomTypeDescription").val(description);

        // Clear and repopulate amenities
        editAmenitiesArray = Array.isArray(amenities) ? [...amenities] : [];
        updateEditAmenitiesList();
    });

    // Set up event delegation for delete buttons
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        $("#deleteRoomTypeId").val(id);
    });
});

// Function to get all room types
function getRoomtype() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/roomType/getAll',
        type: 'GET',
        dataType: 'json',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
            displayRoomTypes(response);
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load room types: ' + error
            });
        }
    });
}

// Function to display room types in the table
function displayRoomTypes(response) {
    let roomTypeBody = $("#roomTypeBody");
    roomTypeBody.empty();

    // Check if response is an object with data property
    const roomTypes = Array.isArray(response) ? response :
        (response.data ? response.data :
            (response.content ? response.content : []));

    if (roomTypes.length === 0) {
        roomTypeBody.append('<tr><td colspan="4" class="text-center">No room types found</td></tr>');
        return;
    }

    roomTypes.forEach(function(roomType) {
        let amenitiesList = roomType.amenities.join(', ');
        let row = `
            <tr>
                <td>${roomType.room_type}</td>
                <td>${roomType.description}</td>
                <td>${amenitiesList}</td>
                <td>
                    <button class="btn btn-sm btn-success edit-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#editRoomTypeModal" 
                            data-id="${roomType.id}" 
                            data-room-type="${roomType.room_type}" 
                            data-description="${roomType.description}" 
                            data-amenities='${JSON.stringify(roomType.amenities)}'>
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#deleteRoomTypeModal" 
                            data-id="${roomType.id}">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        roomTypeBody.append(row);
    });
}

// Function to add an amenity to the list in Add modal
function addAmenity() {
    const amenity = $("#roomTypeAmenities").val().trim();
    if (amenity !== "") {
        amenitiesArray.push(amenity);
        updateAmenitiesList();
        $("#roomTypeAmenities").val("").focus();
    }
}

// Function to update the amenities list display in Add modal
function updateAmenitiesList() {
    const amenitiesList = $("#amenitiesList");
    amenitiesList.empty();

    amenitiesArray.forEach(function(amenity, index) {
        const amenityItem = `
            <span class="amenity-item">
                ${amenity}
                <span class="remove-amenity" data-index="${index}">×</span>
            </span>
        `;
        amenitiesList.append(amenityItem);
    });

    // Add event handler for removing amenities
    $(".remove-amenity").click(function() {
        const index = $(this).data('index');
        amenitiesArray.splice(index, 1);
        updateAmenitiesList();
    });
}

// Function to add an amenity to the list in Edit modal
function addEditAmenity() {
    const amenity = $("#editRoomTypeAmenities").val().trim();
    if (amenity !== "") {
        editAmenitiesArray.push(amenity);
        updateEditAmenitiesList();
        $("#editRoomTypeAmenities").val("").focus();
    }
}

// Function to update the amenities list display in Edit modal
function updateEditAmenitiesList() {
    const amenitiesList = $("#editAmenitiesList");
    amenitiesList.empty();

    editAmenitiesArray.forEach(function(amenity, index) {
        const amenityItem = `
            <span class="amenity-item">
                ${amenity}
                <span class="remove-edit-amenity" data-index="${index}">×</span>
            </span>
        `;
        amenitiesList.append(amenityItem);
    });

    // Add event handler for removing amenities
    $("#editAmenitiesList .remove-edit-amenity").click(function() {
        const index = $(this).data('index');
        editAmenitiesArray.splice(index, 1);
        updateEditAmenitiesList();
    });
}

// Function to save a new room type
function saveRoomType() {
    const roomType = $("#roomTypeName").val().trim();
    const description = $("#roomTypeDescription").val().trim();

    if (roomType === "") {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Room Type cannot be blank'
        });
        return;
    }

    if (description === "") {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Description cannot be blank'
        });
        return;
    }

    if (amenitiesArray.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'At least one amenity is required'
        });
        return;
    }

    const roomTypeData = {
        room_type: roomType,
        description: description,
        amenities: amenitiesArray
    };

    $.ajax({
        url: 'http://localhost:8080/api/v1/roomType/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(roomTypeData),
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Room Type added successfully'
            }).then(() => {
                // Close modal and refresh list
                $('#addRoomTypeModal').modal('hide');
                resetAddModal();
                getRoomtype();
            });
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add room type: ' + xhr.responseText
            });
        }
    });
}

// Function to update a room type
function updateRoomType() {
    const id = $("#editRoomTypeId").val();
    const roomType = $("#editRoomTypeName").val().trim();
    const description = $("#editRoomTypeDescription").val().trim();

    if (roomType === "") {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Room Type cannot be blank'
        });
        return;
    }

    if (description === "") {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Description cannot be blank'
        });
        return;
    }

    if (editAmenitiesArray.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'At least one amenity is required'
        });
        return;
    }

    const roomTypeData = {
        id: id,
        room_type: roomType,
        description: description,
        amenities: editAmenitiesArray
    };

    $.ajax({
        url: 'http://localhost:8080/api/v1/roomType/update',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(roomTypeData),
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Room Type updated successfully'
            }).then(() => {
                // Close modal and refresh list
                $('#editRoomTypeModal').modal('hide');
                getRoomtype();
            });
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update room type: ' + xhr.responseText
            });
        }
    });
}

// Function to delete a room type
function deleteRoomType() {
    const id = $("#deleteRoomTypeId").val();
    console.log(id , " room type ID")

    $.ajax({
        url: 'http://localhost:8080/api/v1/roomType/delete?roomTypeID=' + id,
        type: 'DELETE',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Room Type deleted successfully'
            }).then(() => {
                // Close modal and refresh list
                $('#deleteRoomTypeModal').modal('hide');
                getRoomtype();
            });
        },
        error: function(xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete room type: ' + xhr.responseText
            });
        }
    });
}

// Reset add modal when closed
$('#addRoomTypeModal').on('hidden.bs.modal', function () {
    resetAddModal();
});

// Function to reset add modal
function resetAddModal() {
    $("#roomTypeName").val("");
    $("#roomTypeDescription").val("");
    $("#roomTypeAmenities").val("");
    amenitiesArray = [];
    updateAmenitiesList();
}

// Reset edit modal when closed
$('#editRoomTypeModal').on('hidden.bs.modal', function () {
    $("#editRoomTypeName").val("");
    $("#editRoomTypeDescription").val("");
    $("#editRoomTypeAmenities").val("");
    editAmenitiesArray = [];
    updateEditAmenitiesList();
});