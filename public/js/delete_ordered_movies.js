// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


function deleteOrderedMovie(orderedMovieID) {
    // Put data we want to send in a javascript object
    let data = {
        id: orderedMovieID
    };

    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-ordered-movies-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(orderedMovieID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Find row to delete
function deleteRow(orderedMovieID){
    let table = document.getElementById("ordered-movies-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == orderedMovieID) {
            table.deleteRow(i);
            break;
       }
    }
}
