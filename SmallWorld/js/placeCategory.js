function getAll() {
    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/getAll",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.code === 200 && response.data) {
                let tableBody = ''; // String to store the table rows

                $('.category-management-section table tbody').empty();
                // Loop through each category in the response data
                response.data.forEach(function(category) {
                    tableBody += `
                    <tr>
                       
                        <td>${category.name}</td>
                        <td>${category.description}</td>
                        <td>
                            <button class="btn btn-sm btn-success"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editCategoryModal"
                                    data-id="${category.id}"
                                    data-name="${category.name}"
                                    data-description="${category.description}">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteCategoryModal"
                                    data-id="${category.id}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </td>
                    </tr>`;
                });

                // Append the rows to the table
                $('.category-management-section table tbody').html(tableBody);
            } else {
                console.error("Failed to fetch categories: ", response.message);
            }
        },
        error: function (error) {
            console.error("An error occurred while fetching categories:", error);
        }
    });
}

$('#editCategoryBtn').on('click', function()  {
    let category = {
        id: $('#editCategoryId').val(),
        name: $('#editCategoryName').val(),
        description: $('#editCategoryDescription').val()
    }
    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/update",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(category),
        dataType: "json",
        success: function (response) {
            console.log(response);
                getAll();
                $('#editCategoryName').val('');
                $('#editCategoryDescription').val('');
                $('#editCategoryModal').modal('hide');

        },
        error: function (error) {
            console.error("An error occurred while updating category:", error);
        }
    });
});

$('#saveCategoryBtn').on('click', function() {
    console.log("Clicked")
    let category = {
        name: $('#categoryName').val(),
        description: $('#categoryDescription').val()
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/save",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(category),
        dataType: "json",
        success: function (response) {
            console.log(response);
            getAll();
            $('#categoryName').val('');
            $('#categoryDescription').val('');
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Category saved successfully',
                showConfirmButton: false,
                timer: 1500
            });
        },
        error: function (error) {
            console.error("An error occurred while saving category:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while trying to save the category. Please try again.',
            });
        }
    });
});

$('#deleteCategoryBtn').on('click', function() {
    console.log("Clicked")
    let id = $('#deleteCategoryId').val();
    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/delete/" + id,
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        type: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
            //getAll();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Category deleted successfully',
                showConfirmButton: false,
                timer: 1500
            })
                getAll();
        },
        error: function (error) {
            console.error("An error occurred while deleting category:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while trying to delete the category. Please try again.',
            });
        }
    });
});

// Call the function to fetch and populate the table when the page loads
$(document).ready(function() {
    getAll();
});
