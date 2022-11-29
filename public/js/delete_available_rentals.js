//Code referenced from: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data


function deleteAvailableRental(availableRentalID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: availableRentalID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-available-rentals-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
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


function deleteRow(availableRentalID){

    let table = document.getElementById("available-rentals-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
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