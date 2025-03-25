
    $(document).ready(function () {
    // Get the category ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');
    console.log(placeId)

    // Fetch category details using the ID
    $.ajax({
    url: `http://localhost:8080/api/v1/place/getOne/${placeId}`,
    headers: {
    Authorization: "Bearer " + "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsInN1YiI6ImRpbHNoYW5AZ21haWwuY29tIiwiaWF0IjoxNzQyMjc4Nzg4LCJleHAiOjE3NDMzMTU1ODh9.a9c-iVn2SYAS96w6iU_zsigxrIzuief_0ZYYGmF4O5bnH3wo7EztPdrtloj7y_e5qNn8MRRGbgsVcOZ5eYcLSQ"
},
    type: "GET",
    success: function (response) {
    if (response.code === 200 && response.data) {

} else {
    console.error("Failed to fetch category details: ", response.message);
}
},
    error: function (error) {
    console.error("An error occurred while fetching category details:", error);
}
});
});
