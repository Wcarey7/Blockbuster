// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let addLocationForm = document.getElementById('add-location-form-ajax');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStreet = document.getElementById("input-location_street");
    let inputCity = document.getElementById("input-location_city");
    let inputState = document.getElementById("input-location_state");
    let inputZip = document.getElementById("input-input-location_zip");
    let inputPhone = document.getElementById("input-location_phone_number");

    // Get the values from the form fields
    let streetValue = inputStreet.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipValue = inputZip.value;
    let phoneValue = inputPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        street: streetValue,
        city: cityValue,
        state: stateValue,
        zip: zipValue,
        phone: phoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStreet.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZip.value = '';
            inputPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Locations
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("location-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let streetCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.location_id;
    streetCell.innerText = newRow.location_street;
    cityCell.innerText = newRow.location_city;
    stateCell.innerText = newRow.location_state;
    zipCell.innerText = newRow.location_zip;
    phoneCell.innerText = newRow.location_phone_number;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteLocation(newRow.location_id);
    };

    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(streetCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCell);
    row.appendChild(phoneCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.location_id);

    // Add the row to the table
    currentTable.appendChild(row);

}
