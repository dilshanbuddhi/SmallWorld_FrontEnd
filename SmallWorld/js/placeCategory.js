function getAll() {
    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/getAll",
        headers: {
            Authorization: "Bearer " +"eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
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
                        <td>${category.id}</td>
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
            Authorization: "Bearer " +"eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
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
            Authorization: "Bearer " +"eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
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

        },
        error: function (error) {
            console.error("An error occurred while saving category:", error);
        }
    });
});

$('#deleteCategoryBtn').on('click', function() {
    console.log("Clicked")
    let id = $('#deleteCategoryId').val();
    $.ajax({
        url: "http://localhost:8080/api/v1/placeCategory/delete/" + id,
        headers: {
            Authorization: "Bearer " +"eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
        },
        type: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            console.log(response);
                getAll();
        },
        error: function (error) {
            console.error("An error occurred while deleting category:", error);
        }
    });
});

// Call the function to fetch and populate the table when the page loads
$(document).ready(function() {



    getAll();
});
