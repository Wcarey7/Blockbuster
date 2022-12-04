// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


let updateOrderForm = document.getElementById('update-order-form-ajax');

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

            // Clear the input fields
            inputOrderId.value = '';
            inputCustomerId.value = '';
            inputLocationId.value = '';
            inputOrderDate.value = '';
            inputReturnDate.value = '';

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
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let customerId = updateRowIndex.getElementsByTagName("td")[1];
            let locationId = updateRowIndex.getElementsByTagName("td")[2];
            let orderDate = updateRowIndex.getElementsByTagName("td")[3];
            let returnDate = updateRowIndex.getElementsByTagName("td")[4];
            let overDue = updateRowIndex.getElementsByTagName("td")[5];

            // set to what row to update 
            let tableRow = i-1;

            // Reassign the value we updated to
            customerId.innerHTML = parsedData[tableRow].Customer_Name; 
            locationId.innerHTML = parsedData[tableRow].Location_Address;
            orderDate.innerHTML = parsedData[tableRow].Order_Date;
            returnDate.innerHTML = parsedData[tableRow].Return_Date;
            overDue.innerHTML = parsedData[tableRow].Is_Overdue;
       }
    }
}


// Fill update html form on selection change
function autoFill() {
    let selectElement = document.getElementById('update-order');
    let selectElement_id = selectElement.value;

    // If the element selected is empty, clear all values in the form
    if (selectElement_id === '') {
        document.getElementById("update-customer-id").value = ''
        document.getElementById("update-location-id").value = ''
        document.getElementById("update-order-date").value = ''
        document.getElementById("update-return-date").value = ''
        document.getElementById("update-overdue").value = '0'

    } else {
        let table = document.getElementById('orders-table');

        // Fill each form field with the selected order info
        for (let i = 0, row; row = table.rows[i]; i++) {

            if (table.rows[i].getAttribute('data-value') == selectElement_id) {

                let updateRowIndex = table.getElementsByTagName("tr")[i];

                let td1 = updateRowIndex.getElementsByTagName("td")[1];
                document.getElementById('update-customer-id').value = td1.getAttribute('data-customer_id');

                let td2 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('update-location-id').value = td2.getAttribute('data-location_id');

                let td3 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('update-order-date').value = td3.getAttribute('data-orderDate_id');

                let td4 = updateRowIndex.getElementsByTagName("td")[4];
                document.getElementById('update-return-date').value = td4.innerHTML;

                let td5 = updateRowIndex.getElementsByTagName("td")[5];
                document.getElementById('update-overdue').value = td5.innerHTML;
                console.log(td1.innerHTML);
            }
        }
    }
}