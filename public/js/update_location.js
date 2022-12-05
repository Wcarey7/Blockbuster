// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


let updateLocationForm = document.getElementById('update-location-form-ajax');

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

            // Remove the name from the dropdown menu   
            deleteDropDownMenu(locationID);

            // Add updated name to dropdown menu
             let selectMenu = document.getElementById("update-location");
             let option = document.createElement("option");
             option.text = '#' + parsedData[tableRow].location_id + ': ' +  parsedData[tableRow].location_street + ', ' + parsedData[tableRow].location_city + ', ' + parsedData[tableRow].location_state;
             option.value = locationID;
             selectMenu.add(option);
        }
     }
}


function deleteDropDownMenu(locationID){
    let selectMenu = document.getElementById("update-location");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(locationID)){
        selectMenu[i].remove();
        break;
      }  
    }
}


// Fill update html form on selection change
function autoFill() {
    let selectElement = document.getElementById('update-location');
    let selectElement_id = selectElement.value;

    // If the element selected is empty, clear all values in the form
    if (selectElement_id === '') {
        document.getElementById("input-update-street").value = ''
        document.getElementById("input-update-city").value = ''
        document.getElementById("input-update-state").value = ''
        document.getElementById("input-update-zip").value = ''
        document.getElementById("input-update-phone").value = ''


    } else {
        let table = document.getElementById('location-table');
        // Fill each form field with the selected customers info
        for (let i = 0, row; row = table.rows[i]; i++) {

            if (table.rows[i].getAttribute('data-value') == selectElement_id) {

                let updateRowIndex = table.getElementsByTagName("tr")[i];

                let td1 = updateRowIndex.getElementsByTagName("td")[1];
                document.getElementById('input-update-street').value = td1.innerHTML;

                let td2 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('input-update-city').value = td2.innerHTML;

                let td3 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('input-update-state').value = td3.innerHTML;

                let td4 = updateRowIndex.getElementsByTagName("td")[4];
                document.getElementById('input-update-zip').value = td4.innerHTML;

                let td5 = updateRowIndex.getElementsByTagName("td")[5];
                document.getElementById('input-update-phone').value = td5.innerHTML;

            }
        }
    }
}