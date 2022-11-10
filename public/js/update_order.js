// Referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data


// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderId = document.getElementById("update-order");
    let inputCustomerId = document.getElementById("update-customer-id");
    let inputLocationId = document.getElementById("update-location-id");
    let inputOrderDate = document.getElementById("update-order-date");
    let inputReturnDate = document.getElementById("update-return-date");
    let inputOverdue = document.getElementById("update-overdue");


    // Get the values from the form fields
    let orderIdValue = inputOrderId.value;
    let customerIdValue = inputCustomerId.value;
    let locationIdValue = inputLocationId.value;
    let orderDateValue = inputOrderDate.value;
    let returnDateValue = inputReturnDate.value;
    let overDueValue = inputOverdue.value;


    // Put data we want to send in a javascript object
    let data = {
        order: orderIdValue,
        customer: customerIdValue,
        location: locationIdValue,
        orderDate: orderDateValue,
        returnDate: returnDateValue,
        overDue: overDueValue,
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateOrderRow(xhttp.response, orderIdValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



function updateOrderRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

             // Get td of value
             let customerId = updateRowIndex.getElementsByTagName("td")[1];
             let locationId = updateRowIndex.getElementsByTagName("td")[2];
             let orderDate = updateRowIndex.getElementsByTagName("td")[3];
             let returnDate = updateRowIndex.getElementsByTagName("td")[4];
             let overDue = updateRowIndex.getElementsByTagName("td")[5];

             //set to what row to update 
             let tableRow = i-1;

             // Reassign the value we updated to
             customerId.innerHTML = parsedData[tableRow].customer_id; 
             locationId.innerHTML = parsedData[tableRow].location_id;
             orderDate.innerHTML = parsedData[tableRow].order_date;
             returnDate.innerHTML = parsedData[tableRow].return_date;
             overDue.innerHTML = parsedData[tableRow].over_due;
       }
    }
}