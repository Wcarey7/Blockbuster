// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    //let inputFirstName = document.getElementById("input-fname");
    //let inputLastName = document.getElementById("input-lname");
    let inputStreet = document.getElementById("input-update-street");
    let inputCity = document.getElementById("input-update-city");
    /*let inputState = document.getElementById("input-state");
    let inputZip = document.getElementById("input-zip");
    let inputPhone = document.getElementById("input-phone");
    let inputActiveRentals = document.getElementById("input-active-rentals");
    let inputTotalRentals = document.getElementById("input-total-rentals"); */

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    //let firstNameValue = inputFirstName.value;
    //let lastNameValue = inputLastName.value;
    let streetValue = inputStreet.value;
    let cityValue = inputCity.value;
    /*let stateValue = inputState.value;
    let zipValue = inputZip.value;
    let phoneValue = inputPhone.value;
    let activeRentalsValue = inputActiveRentals.value;
    let totalRentalsValue = inputTotalRentals.value; */


    // currently the database table for Customers does not allow updating values to NULL
    // so we must abort if being bassed NULL for Customer name

    //if (isNaN(fullNameValue)) 
    //{
       // return;
    //}


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        //fname: firstNameValue,
        //lname: lastNameValue,
        street: streetValue,
        city: cityValue,
        /*state: stateValue,
        zip: zipValue,
        phone: phoneValue,
        activeRentals: activeRentalsValue,
        totalRentals: totalRentalsValue */
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);


            // Clear the input fields for another transaction
            inputFullName.value = '';
            inputStreet.value = '';
/*             inputCity.value = '';
            inputState.value = '';
            inputZip.value = '';
            inputPhone.value = '';
            inputActiveRentals.value = '';
            inputTotalRentals.value = ''; */
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



function updateRow(data, customerID) {
    let parsedData = JSON.parse(data);

    // Get a reference to the current table on the page and clear it out.
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == customerID) {
 
             // Get the location of the row where we found the matching customer ID
             let updateRowIndex = table.getElementsByTagName("tr")[i];
 
             // Get td of street value
             let td = updateRowIndex.getElementsByTagName("td")[3];
 
             // Reassign street to our value we updated to
             td.innerHTML = parsedData[0].customer_street; 
        }
     }




}