// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputStreet = document.getElementById("input-street");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputZip = document.getElementById("input-zip");
    let inputPhone = document.getElementById("input-phone");
    let inputActiveRentals = document.getElementById("input-active-rentals");
    let inputTotalRentals = document.getElementById("input-total-rentals");

    // Get the values from the form fields
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
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
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


// Creates a single row from an Object representing a single record from 
// Customers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customer-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let streetCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let activeRentalsCell = document.createElement("TD");
    let totalRentalsCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.customer_id;
    firstNameCell.innerText = newRow.first_name;
    lastNameCell.innerText = newRow.last_name;
    streetCell.innerText = newRow.customer_street;
    cityCell.innerText = newRow.customer_city;
    stateCell.innerText = newRow.customer_state;
    zipCell.innerText = newRow.customer_zip;
    phoneCell.innerText = newRow.customer_phone_number;
    activeRentalsCell.innerText = newRow.customer_active_rentals;
    totalRentalsCell.innerText = newRow.customer_total_rentals;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteCustomer(newRow.customer_id);
    };

    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(streetCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCell);
    row.appendChild(phoneCell);
    row.appendChild(activeRentalsCell);
    row.appendChild(totalRentalsCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.customer_id);

    // Add the row to the table
    currentTable.appendChild(row);


    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.first_name + ' ' +  newRow.last_name;
    option.value = newRow.customer_id;
    selectMenu.add(option);
}
