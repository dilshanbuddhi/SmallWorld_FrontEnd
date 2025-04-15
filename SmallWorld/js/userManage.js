getAllUsers();

function getAllUsers() {
    $.ajax({
        url: "http://localhost:8080/api/v1/user/getAll",
        method: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response);

            const users = response.data; // Ensure you're accessing the 'data' array
            const tbody = $("#userTableBody");
            tbody.empty(); // Clear existing rows

            users.forEach((user) => {
                const row = `
                    <tr>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.country}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>
                            <button class="btn btn-sm btn-success edit-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editUserModal"
                                    data-id="${user.uid}"
                                    data-firstname="${user.firstName}"
                                    data-lastname="${user.lastName}"
                                    data-country="${user.country}"
                                    data-email="${user.email}"
                                    data-role="${user.role}">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger delete-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteUserModal"
                                    data-id="${user.email}">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });

            // Optional: Add event listeners for edit/delete buttons if needed
        },
        error: function (xhr, status, error) {
            console.log("Error fetching users:", error);
        }
    });
}

$("#editUserModal form").submit(function (e) {
    e.preventDefault(); // stop default form submission

    const userId = $("#editUserId").val();
    const updatedUser = {
        uid: userId,
        firstName: $("#editfirstname").val(),
        lastName: $("#editsecname").val(),
        country: $("#editUserModal select[name='role']").first().val(), // for country dropdown
        email: $("#editEmail").val(),
        role: $("#editRole").val()
    };
    console.log(updatedUser);

    $.ajax({
        url: "http://localhost:8080/api/v1/user/update", // adjust this URL if needed
        method: "PUT", // or POST depending on your backend
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        data: JSON.stringify(updatedUser),
        success: function (response) {
            alert("User updated successfully!");
            $("#editUserModal").modal('hide');
            getAllUsers(); // reload the table
        },
        error: function (xhr, status, error) {
            console.error("Update failed:", error);
            alert("Failed to update user.");
        }
    });
});


$(document).on("click", ".edit-btn", function () {

    // Get data from the clicked button
    const userId = $(this).data("id");
    const firstName = $(this).data("firstname");
    const lastName = $(this).data("lastname");
    const country = $(this).data("country");
    const email = $(this).data("email");
    const role = $(this).data("role");

    console.log(role,   " ghjk");

    // Set values in modal inputs
    $("#editUserId").val(userId);
    $("#editfirstname").val(firstName);
    $("#editsecname").val(lastName);
    $("#editUserModal select[name='role']").val(country); // setting country
    $("#editEmail").val(email);
    $("#editRole").val(role);

    // Optionally store the ID somewhere to use in form submission
    $("#editUserModal").data("userid", userId);
});


$("#delete-user-btn").click(function () {
    const userId = $("#deleteUserId").val();

    $.ajax({
        url: "http://localhost:8080/api/v1/user/delete/" + userId, // Adjust URL if needed
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log(response)
            alert("User deleted successfully!");
            $("#deleteUserModal").modal('hide');
            getAllUsers(); // Refresh the user table
        },
        error: function (xhr, status, error) {
            console.log("Delete failed:", error);
            alert("Failed to delete user.");
        }
    });
});
$(document).on("click", "#delete-btn", function () {
    const userId = $(this).data("id");
    $("#deleteUserId").val(userId); // set in hidden input
});



