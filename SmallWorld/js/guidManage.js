$(document).ready(function () {
    getAllGuidForTable();
});

// Load all guides into the table
function getAllGuidForTable() {
    $.ajax({
        url: "http://localhost:8080/api/v1/guid/getAll",
        type: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            if (response.code === 200) {
                const guideData = response.data;
                const tableBody = $("#guideTableBody");
                tableBody.empty();

                guideData.forEach(guide => {
                    const languages = guide.languages.join(", ");
                    const certifications = guide.certifications.join(", ");
                    const row = `
                        <tr>
                            <td>${guide.id}</td>
                            <td>${guide.name}</td>
                            <td>${guide.email}</td>
                            <td>${guide.phone_number}</td>
                            <td>${languages}</td>
                            <td>${guide.experience_of_years}</td>
                            <td>${certifications}</td>
                            <td><img src="${guide.profile_image}" class="img-thumbnail" width="50" height="50"></td>
                            <td>
                               
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal"
                                        data-bs-target="#deleteUserModal"
                                        data-id="${guide.id}">
                                    <i class="bi bi-trash"></i> Delete
                                </button>
                            </td>
                        </tr>`;
                    tableBody.append(row);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching guides:", error);
        }
    });
}

// When delete modal is shown
const deleteUserModal = document.getElementById('deleteUserModal');
deleteUserModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const userId = button.getAttribute('data-id');
    document.getElementById('deleteUserId').value = userId;
});

// Delete guide by ID
$("#delete").on("click", function () {
    const id = $("#deleteUserId").val();
    $.ajax({
        url: "http://localhost:8080/api/v1/guid/delete/" + id,
        type: "DELETE",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            if (response.code === 200) {
                $('#deleteUserModal').modal('hide');
                getAllGuidForTable();
            } else {
                alert("Failed to delete guide.");
            }
        },
        error: function (xhr, status, error) {
            console.error("Delete error:", error);
        }
    });
});
