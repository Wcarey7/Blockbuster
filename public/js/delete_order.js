// Referenced structure and AJAX request from: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function deleteOrder(orderID) {
    // Put data we want to send in a javascript object
    let data = {
        id: orderID
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(orderID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Find row to delete, then remove item from dropdown menu
function deleteRow(orderID){
    let table = document.getElementById("orders-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == orderID) {
            table.deleteRow(i);
            deleteDropDownMenu(orderID);
            break;
       }
    }
}


function deleteDropDownMenu(orderID){
    let selectMenu = document.getElementById("update-order");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(orderID)){
        selectMenu[i].remove();
        break;
      } 
    }
  }