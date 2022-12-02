// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function deleteCustomer(customerID) {
    // Put data we want to send in a javascript object
    let data = {
        id: customerID
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(customerID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Find row to delete, then remove item from dropdown menu
function deleteRow(customerID){
    let table = document.getElementById("customer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            deleteDropDownMenu(customerID);
            break;
       }
    }
}


function deleteDropDownMenu(customerID){
    let selectMenu = document.getElementById("update-customer");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(customerID)){
        selectMenu[i].remove();
        break;
      }  
    }
  }
