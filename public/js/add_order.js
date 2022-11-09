// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerId = document.getElementById("input-customer-id");
    let inputLocationId = document.getElementById("input-location-id");
    let inputOrderDate = document.getElementById("input-order-date");
    let inputReturnDate = document.getElementById("input-return-date");
    let inputOverdue = document.getElementById("input-overdue");


    // Get the values from the form fields
    let customerIdValue = inputCustomerId.value;
    let locationIdValue = inputLocationId.value;
    let orderDateValue = inputOrderDate.value;
    let returnDateValue = inputReturnDate.value;
    let overDueValue = inputOverdue.value;


    // Put our data we want to send in a javascript object
    let data = {
        customer: customerIdValue,
        location: locationIdValue,
        orderDate: orderDateValue,
        returnDate: returnDateValue,
        overDue: overDueValue,

    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCustomerId.value = '';
            inputLocationId.value = '';
            inputOrderDate.value = '';
            inputReturnDate.value = '';
            inputOverdue.value = '';
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
    let currentTable = document.getElementById("orders-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");
    let orderIdCell = document.createElement("TD");
    let customerIdCell = document.createElement("TD");
    let locationIdCell = document.createElement("TD");
    let orderDateCell = document.createElement("TD");
    let returnDateCell = document.createElement("TD");
    let overDueCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIdCell.innerText = newRow.order_id
    customerIdCell.innerText = newRow.customer_id;
    locationIdCell.innerText = newRow.location_id;
    orderDateCell.innerText = newRow.order_date;
    returnDateCell.innerText = newRow.return_date;
    overDueCell.innerText = newRow.over_due;


    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteOrder(newRow.order_id);
    };

    deleteCell.appendChild(deleteButton);


    // Add the cells to the row 
    row.appendChild(orderIdCell);
    row.appendChild(customerIdCell);
    row.appendChild(locationIdCell);
    row.appendChild(orderDateCell);
    row.appendChild(returnDateCell);
    row.appendChild(overDueCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.order_id);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("orderSelect");
    let option = document.createElement("option");
    option.text = newRow.customer_id;
    option.value = newRow.order_id;
    selectMenu.add(option);
}