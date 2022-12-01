// Referenced structure and AJAX request from: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

let addOrderedMovieForm = document.getElementById('add-ordered-movie-form-ajax');

addOrderedMovieForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderedId = document.getElementById("ordered-movie-order-id");
    let inputMovieId = document.getElementById("input-movie-id");
    let inputQuantity = document.getElementById("input-order-movie-quantity");


    // Get the values from the form fields
    let orderedIdValue = inputOrderedId.value;
    let movieIdValue = inputMovieId.value;
    let quantityValue = inputQuantity.value;


    // Put data we want to send in a javascript object
    let data = {
        orderId: orderedIdValue,
        movieId: movieIdValue,
        quantity: quantityValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ordered-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderedId.value = '';
            inputMovieId.value = '';
            inputQuantity.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Update frontend with new row
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("ordered-movies-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row
    let row = document.createElement("TR");
    let orderedMovieIdCell = document.createElement("TD");
    let orderedIdCell = document.createElement("TD");
    let movieIdCell = document.createElement("TD");
    let quantityIdCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderedMovieIdCell.innerText = newRow.ordered_movies_id
    orderedIdCell.innerText = newRow.order_id
    movieIdCell.innerText = newRow.movie_title;
    quantityIdCell.innerText = newRow.quantity;


    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteOrderedMovie(newRow.ordered_movies_id);
    };

    deleteCell.appendChild(deleteButton);


    // Add the cells to the row 
    row.appendChild(orderedMovieIdCell);
    row.appendChild(orderedIdCell);
    row.appendChild(movieIdCell);
    row.appendChild(quantityIdCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.ordered_movies_id);

    // Add the row to the table
    currentTable.appendChild(row);

}