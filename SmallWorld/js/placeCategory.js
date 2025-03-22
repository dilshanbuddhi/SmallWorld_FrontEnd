/*
getAll();

function getAll() {
    $.ajax({
        url: "http://localhost:8080/api/placeCategory/getAll",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data);
            for (let placeCategory of data) {
                console.log(placeCategory);
                let row = '<tr>';
                row += '<td>' + placeCategory.id + '</td>';
                row += '<td>
            }*/
