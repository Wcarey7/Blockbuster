// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function deleteAvailableRental(availableRentalID) {
    // Put data we want to send in a javascript object
    let data = {
        id: availableRentalID
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-available-rentals-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(availableRentalID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Find row to delete, then remove item from dropdown menu
function deleteRow(availableRentalID){
    let table = document.getElementById("available-rentals-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == availableRentalID) {
            table.deleteRow(i);
            deleteDropDownMenu(availableRentalID);
            break;
       }
    }
}


function deleteDropDownMenu(availableRentalID){
    let selectMenu = document.getElementById("update-available-rentals");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(availableRentalID)){
        selectMenu[i].remove();
        break;
      } 
    }
  }