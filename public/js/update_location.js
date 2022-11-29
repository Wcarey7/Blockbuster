// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let updateLocationForm = document.getElementById('update-location-form-ajax');

// Modify the objects we need
updateLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocationId = document.getElementById("update-location");
    let inputStreet = document.getElementById("input-update-street");
    let inputCity = document.getElementById("input-update-city");
    let inputState = document.getElementById("input-update-state");
    let inputZip = document.getElementById("input-update-zip");
    let inputPhone = document.getElementById("input-update-phone");

    // Get the values from the form fields
    let locationIdValue = inputLocationId.value;
    let streetValue = inputStreet.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipValue = inputZip.value;
    let phoneValue = inputPhone.value;


    // Put our data we want to send in a javascript object
    let data = {
        locationId: locationIdValue,
        street: streetValue,
        city: cityValue,
        state: stateValue,
        zip: zipValue,
        phone: phoneValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateLocationRow(xhttp.response, locationIdValue);

            // Clear the input fields
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



function updateLocationRow(data, locationID) {
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("location-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == locationID) {
             // Get the location of the row where we found the matching location ID
             let updateRowIndex = table.getElementsByTagName("tr")[i];
 
             // Get td of value
             let locationStreet = updateRowIndex.getElementsByTagName("td")[1];
             let locationCity = updateRowIndex.getElementsByTagName("td")[2];
             let locationState = updateRowIndex.getElementsByTagName("td")[3];
             let locationZip = updateRowIndex.getElementsByTagName("td")[4];
             let locationPhone = updateRowIndex.getElementsByTagName("td")[5];
             
             //set to what row to update
             let tableRow = i-1;

             // Reassign the value we updated to
             locationStreet.innerHTML = parsedData[tableRow].location_street;
             locationCity.innerHTML = parsedData[tableRow].location_city;
             locationState.innerHTML = parsedData[tableRow].location_state;
             locationZip.innerHTML = parsedData[tableRow].location_zip;
             locationPhone.innerHTML = parsedData[tableRow].location_phone_number;
        }
     }
}