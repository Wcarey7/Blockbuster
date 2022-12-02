// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


let addAvailRentalForm = document.getElementById('add-available-rental-form-ajax');

addAvailRentalForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMovieId = document.getElementById("input-avail-movie-id");
    let inputLocationId = document.getElementById("input-avail-location-id");
    let inputAvailCopies = document.getElementById("input-available-copies");

    // Get the values from the form fields
    let movieIdValue = inputMovieId.value;
    let locationIdValue = inputLocationId.value;
    let availCopiesValue = inputAvailCopies.value;

    // DATA Packet
    let data = {
        movieId: movieIdValue,
        locationId: locationIdValue,
        availCopies: availCopiesValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-available-rentals-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputMovieId.value = '';
            inputLocationId.value = '';
            inputAvailCopies.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Update frontend with new row
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("available-rentals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let availIdCell = document.createElement("TD");
    let movieTitleCell = document.createElement("TD");
    let locationAddressCell = document.createElement("TD");
    let availCopiesIdCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    availIdCell.innerText = newRow.avail_id
    movieTitleCell.innerText = newRow.movie_title
    locationAddressCell.innerText = newRow.Location;
    availCopiesIdCell.innerText = newRow.avail_copies;


    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteAvailableRental(newRow.avail_id);
    };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(availIdCell);
    row.appendChild(movieTitleCell);
    row.appendChild(locationAddressCell);
    row.appendChild(availCopiesIdCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.avail_id);

    // Add the row to the table
    currentTable.appendChild(row);

}