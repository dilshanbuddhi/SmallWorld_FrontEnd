function getGuidData() {
    $.ajax({
        url: "http://localhost:8080/api/v1/guid/profile",
        method: "GET",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: "json",
        success: function (response) {
            localStorage.setItem("guideId", response.data.user_id);
            if (response.code === 200) {
                let data = response.data;
                console.log(data.id  , " fgtuivgugfg8u")
                getGuidrequests(data.id);
                getGuideRequestsByStatus(data.id, "pending");


                // Update profile details
                $("#name").text(data.name);
                $("#email").text(data.email);
                $("#number").text(data.phone_number);
                $("#location").text(data.address);
                $("#about").text(data.about_me);
                $("#years-of-experience").text(data.years_experience);

                // Update profile image
                $(".avatar img").attr("src", data.profile_image);


                // Update languages
                let languagesHtml = "";
                $("#languages").empty();
                data.languages.forEach(lang => {
                    languagesHtml += `<span class="tag">${lang}</span>`;
                });
                $("#languages").html(languagesHtml);
              /*  data.languages.forEach(lang => {
                    languagesHtml += `<span class="tag">${lang}</span>`;
                });
                $("#languages").html(languagesHtml);

                // Update specialization (if available in the API response)
                if (data.certifications) {
                    let specializationsHtml = "";
                    data.certifications.forEach(cert => {
                        specializationsHtml += `<span class="tag">${cert}</span>`;
                    });
                    $(".detail-value").html(specializationsHtml);
                }

                // Update price and availability (if needed)
                if (data.price) {
                    $(".price").text(`Price: ${data.price} LKR`);
                }
                if (data.availability) {
                    $(".availability").text(`Status: ${data.availability}`);
                }*/
            }
        }
        ,
        error: function (error) {
            console.log("Error fetching guide data:", error);
        }
    });
}

/*
function getGuidrequests(id) {
    $.ajax({
        url: "http://localhost:8080/api/v1/tourRequest/getAllById/" + id,
        method: "GET",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: "json",
        success: function (response) {
            if (response.code === 200) {
                let data = response.data;
                $("#requestList").empty(); // Clear existing list

                data.forEach(item => {
                    let requestHTML = `
                        <div class="request-item">
                            <div class="request-header">
                                <div class="request-title" id="title">${item.title ? item.title : 'No Title'}</div>
                                <div class="request-status status-${item.status.toLowerCase()}" id="status">${item.status}</div>
                            </div>
                            <div class="request-details">
                                <div class="request-info">
                                    <p id="date"><strong>Date:</strong> ${item.tourDate}</p>
                                    <p id="tourDuration"><strong>Duration:</strong> ${item.tourDuration}</p>
                                    <p id="groupSize"><strong>Group Size:</strong> ${item.groupSize}</p>
                                </div>
                                <div class="request-info">
                                    <p><strong>Price:</strong> €200</p>
                                    <p id="language"><strong>Language:</strong> ${item.language}</p>
                                    <p id="message"><strong>Special Requests:</strong> ${item.message}</p>
                                </div>
                            </div>
                            <div class="request-user">
                                <div class="user-avatar">
                                    <img src="img/avatar2.webp" alt="User Avatar">
                                </div>
                                <div class="user-info">
                                    <h5 id="username">${item.customerName}</h5>
                                    <p id="userCountry">${item.user.country}</p>
                                </div>
                            </div>
                            <div class="request-actions">
                                <button class="action-btn btn-accept" onclick="updatereq(${item.id} , 'accepted' , id)">Accept Request</button>
                                <button class="action-btn btn-reject" onclick="updatereq(${item.id} , 'rejected' , id)">Decline</button>
                                <button class="action-btn btn-message">Message Client</button>
                            </div>
                        </div>`;
                    $("#requestList").append(requestHTML);
                });
            }
        },
        error: function (error) {
            console.log("Error fetching guide data:", error);
        }
    });
}
*/

// Function to handle tab switching and request filtering
function getGuidrequests(guideId) {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');

    // Add click event listeners to each button
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get the status from button text (Pending, Confirmed, Past Tours)
            let status = this.textContent.trim().split(' ')[0].toLowerCase();

            // Special handling for "Past Tours" - we'll consider them as "completed"
            if (status === "past") {
                status = "completed";
            }

            // Fetch and display requests based on the selected status
            getGuideRequestsByStatus(guideId, status);
        });
    });
}

// Function to fetch and display requests based on status
function getGuideRequestsByStatus(guideId, status) {
    $.ajax({
        url: "http://localhost:8080/api/v1/tourRequest/getAllById/" + guideId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        dataType: "json",
        success: function (response) {
            if (response.code === 200) {
                let data = response.data;
                $("#requestList").empty(); // Clear existing list

                // Filter data based on status
                let filteredData = data.filter(item => {
                    if (status === "pending") {
                        return item.status.toLowerCase() === "pending";
                    } else if (status === "confirmed") {
                        return item.status.toLowerCase() === "accepted";
                    } else if (status === "completed") {
                        return item.status.toLowerCase() === "completed";
                    }
                    return true; // fallback to show all if status doesn't match
                });

                // Update the tab counts
                updateTabCounts(data);

                // If no matching items found
                if (filteredData.length === 0) {
                    $("#requestList").append(`<div class="no-requests">No ${status} requests found</div>`);
                    return;
                }

                // Render the filtered data
                filteredData.forEach(item => {
                    let requestHTML = `
                        <div class="request-item">
                            <div class="request-header">
                                <div class="request-title" id="title">${item.title ? item.title : 'No Title'}</div>
                                <div class="request-status status-${item.status.toLowerCase()}" id="status">${item.status}</div>
                            </div>
                            <div class="request-details">
                                <div class="request-info">
                                    <p id="date"><strong>Date:</strong> ${item.tourDate}</p>
                                    <p id="tourDuration"><strong>Duration:</strong> ${item.tourDuration}</p>
                                    <p id="groupSize"><strong>Group Size:</strong> ${item.groupSize}</p>
                                </div>
                                <div class="request-info">
                                    <p><strong>Price:</strong> €${item.price || 200}</p>
                                    <p id="language"><strong>Language:</strong> ${item.language}</p>
                                    <p id="message"><strong>Special Requests:</strong> ${item.message || 'None'}</p>
                                </div>
                            </div>
                            <div class="request-user">
                                <div class="user-avatar">
                                    <img src="${item.user.profileImage || 'img/avatar2.webp'}" alt="User Avatar">
                                </div>
                                <div class="user-info">
                                    <h5 id="username">${item.customerName}</h5>
                                    <p id="userCountry">${item.user.country}</p>
                                </div>
                            </div>
                            <div class="request-actions">
                                ${status === "pending" ? `
                                    <button class="action-btn btn-accept" onclick="updatereq(${item.id}, 'accepted', ${guideId})">Accept Request</button>
                                    <button class="action-btn btn-reject" onclick="updatereq(${item.id}, 'rejected', ${guideId})">Decline</button>
                                ` : ''}
                                <button class="action-btn btn-message" onclick="openChat('${guideId}', '${item.user.uid}', '${item.customerName}', '${item.user.profileImage || 'img/avatar2.webp'}')">Message Client</button>
                            </div>
                        </div>`;
                    $("#requestList").append(requestHTML);
                });
            }
        },
        error: function (error) {
            console.log("Error fetching guide data:", error);
            $("#requestList").append(`<div class="error-message">Error loading requests. Please try again.</div>`);
        }
    });
}

// Function to open chat in a modal or redirect to chat page
function openChat(guideId, userId, userName, userAvatar) {
    console.log(guideId)
    // Option 1: Open in a modal
    if ($("#chat-modal").length) {
        // If chat modal exists, initialize it
        initializeChat(guideId, userId, "guide", userName, userAvatar);
        $("#chat-modal").modal("show");
    }
    // Option 2: Redirect to chat page
    else {
        // Store current user info if needed
        localStorage.setItem("currentChatPartner", JSON.stringify({
            id: userId,
            name: userName,
            avatar: userAvatar
        }));

        // Redirect to chat page with parameters
        window.location.href = `message.html?partnerId=${userId}&partnerName=${encodeURIComponent(userName)}&partnerAvatar=${encodeURIComponent(userAvatar)}`;
    }
}

// Function to initialize the chat component
function initializeChat(guideId, userId, role, userName, userAvatar) {
    // This function should be defined in your chat.js or inline in your chat page
    // It will set up the WebSocket connection and prepare the chat UI
    if (window.setupChat) {
        window.setupChat(guideId, userId, role, userName, userAvatar);
    } else {
        console.error("Chat initialization function not found!");
    }
}
function updateTabCounts(data) {
    const pendingCount = data.filter(item => item.status.toLowerCase() === "pending").length;
    const confirmedCount = data.filter(item => item.status.toLowerCase() === "accepted").length;
    const completedCount = data.filter(item => item.status.toLowerCase() === "completed").length;

    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.textContent.includes("Pending")) {
            button.textContent = `Pending (${pendingCount})`;
        } else if (button.textContent.includes("Confirmed")) {
            button.textContent = `Confirmed (${confirmedCount})`;
        } else if (button.textContent.includes("Past Tours")) {
            button.textContent = `Past Tours (${completedCount})`;
        }
    });
}


function updatereq(id , status , g_id) {

    console.log(id   ,  status);
    $.ajax({
        url: "http://localhost:8080/api/v1/tourRequest/update/" + id + "/" + status,
        method: "PUT",
        headers: {
            Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQzMzMzNjA0LCJleHAiOjE3NDQzNzA0MDR9.pvTaWycEl_iHVD9JtzCQeG2UbKxjVC8Qh4YM7U6h6L5_hZu1n5-iBHz4_Pf-0crL3TENSD59Dz69ddaO03-74Q"
        },
        dataType: "json",
        success: function (response) {
            if (response.code === 200) {
                getGuideRequestsByStatus(g_id, "pending");
            }
        },
        error: function (error) {
            console.log("Error fetching guide data:", error);
        }
    });
}

// Call the function when the page loads
$(document).ready(function () {
    getGuidData();
    //getGuidrequests();
    });
