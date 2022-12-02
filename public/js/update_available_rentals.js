// Referenced structure and AJAX request from: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

let updateAvailRentalForm = document.getElementById('update-avail-form-ajax');

updateAvailRentalForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateAvailId = document.getElementById("update-avail-rental");
    let updateMovieId = document.getElementById("update-avail-movie-id");
    let updateLocationId = document.getElementById("update-avail-location-id");
    let updateAvailCopies = document.getElementById("update-available-copies");

    // Get the values from the form fields
    let availIdValue = updateAvailId.value;
    let movieIdValue = updateMovieId.value;
    let locationIdValue = updateLocationId.value;
    let availCopiesValue = updateAvailCopies.value;

    // DATA Packet
    let data = {
        availId: availIdValue,
        movieId: movieIdValue,
        locationId: locationIdValue,
        availCopies: availCopiesValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-available-rentals-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateAvailRow(xhttp.response, availIdValue);

            // Clear the input fields for another transaction
            updateAvailId.value = '';
            updateMovieId.value = '';
            updateLocationId.value = '';
            updateAvailCopies.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateAvailRow(data, availID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("available-rentals-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == availID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let movieId = updateRowIndex.getElementsByTagName("td")[1];
            let locationId = updateRowIndex.getElementsByTagName("td")[2];
            let availCopies = updateRowIndex.getElementsByTagName("td")[3];

            // set to what row to update 
            let tableRow = i-1;

            // Reassign the value we updated to
            movieId.innerHTML = parsedData[tableRow].movie_title; 
            locationId.innerHTML = parsedData[tableRow].Location;
            availCopies.innerHTML = parsedData[tableRow].avail_copies;
       }
    }
}


// Fill update html form on selection change
function autoFill() {
    let selectElement = document.getElementById('update-avail-rental');
    let selectElement_id = selectElement.value;
    console.log(selectElement_id)
    // If the element selected is empty, clear all values in the form
    if (selectElement_id === '') {
        document.getElementById("update-avail-movie-id").value = ''
        document.getElementById("update-avail-location-id").value = ''
        document.getElementById("update-available-copies").value = ''

    } else {
        let table = document.getElementById('available-rentals-table');

        // Fill each form field with the selected order info
        for (let i = 0, row; row = table.rows[i]; i++) {

            if (table.rows[i].getAttribute('data-value') == selectElement_id) {

                let updateRowIndex = table.getElementsByTagName("tr")[i];

                let td1 = updateRowIndex.getElementsByTagName("td")[1];
                document.getElementById('update-avail-movie-id').value = td1.parentElement.dataset.value;
                testTD1 = td1
                console.log(testTD1)
                let td2 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('update-avail-location-id').value = td2.innerHTML;

                let td3 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('update-available-copies').value = td3.innerHTML;
            }
        }
    }
}
