// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("update-customer");
    let inputFirstName = document.getElementById("input-update-fname");
    let inputLastName = document.getElementById("input-update-lname");
    let inputStreet = document.getElementById("input-update-street");
    let inputCity = document.getElementById("input-update-city");
    let inputState = document.getElementById("input-update-state");
    let inputZip = document.getElementById("input-update-zip");
    let inputPhone = document.getElementById("input-update-phone");
    let inputActiveRentals = document.getElementById("input-update-active-rentals");
    let inputTotalRentals = document.getElementById("input-update-total-rentals");

    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let streetValue = inputStreet.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipValue = inputZip.value;
    let phoneValue = inputPhone.value;
    let activeRentalsValue = inputActiveRentals.value;
    let totalRentalsValue = inputTotalRentals.value;


    // Put our data we want to send in a javascript object
    let data = {
        customerId: customerIdValue,
        fname: firstNameValue,
        lname: lastNameValue,
        street: streetValue,
        city: cityValue,
        state: stateValue,
        zip: zipValue,
        phone: phoneValue,
        activeRentals: activeRentalsValue,
        totalRentals: totalRentalsValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateCustomerRow(xhttp.response, customerIdValue);

            // Clear the input fields
            inputFirstName.value = '';
            inputLastName.value = '';
            inputStreet.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZip.value = '';
            inputPhone.value = '';
            inputActiveRentals.value = '';
            inputTotalRentals.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



function updateCustomerRow(data, customerID) {
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customerID) {
             // Get the location of the row where we found the matching customer ID
             let updateRowIndex = table.getElementsByTagName("tr")[i];
 
             // Get td of value
             let firstName = updateRowIndex.getElementsByTagName("td")[1];
             let lastName = updateRowIndex.getElementsByTagName("td")[2];
             let customerStreet = updateRowIndex.getElementsByTagName("td")[3];
             let customerCity = updateRowIndex.getElementsByTagName("td")[4];
             let customerState = updateRowIndex.getElementsByTagName("td")[5];
             let customerZip = updateRowIndex.getElementsByTagName("td")[6];
             let customerPhone = updateRowIndex.getElementsByTagName("td")[7];
             let customerActiveRentals = updateRowIndex.getElementsByTagName("td")[8];
             let customerTotalRentals = updateRowIndex.getElementsByTagName("td")[9];
             
             //set to what row to update
             let tableRow = i-1;

             // Reassign the value we updated to
             firstName.innerHTML = parsedData[tableRow].first_name; 
             lastName.innerHTML = parsedData[tableRow].last_name;
             customerStreet.innerHTML = parsedData[tableRow].customer_street;
             customerCity.innerHTML = parsedData[tableRow].customer_city;
             customerState.innerHTML = parsedData[tableRow].customer_state;
             customerZip.innerHTML = parsedData[tableRow].customer_zip;
             customerPhone.innerHTML = parsedData[tableRow].customer_phone_number;
             customerActiveRentals.innerHTML = parsedData[tableRow].customer_active_rentals;
             customerTotalRentals.innerHTML = parsedData[tableRow].customer_total_rentals;

        }
     }
}