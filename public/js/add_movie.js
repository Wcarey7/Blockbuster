// Get the objects we need to modify
let addMovieForm = document.getElementById('add-movie-form-ajax');

// Modify the objects we need
addMovieForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("input-title");
    let inputReleaseDate = document.getElementById("input-release_date");
    let inputGenre = document.getElementById("input-genre");

    let deleteCell = document.createElement("TD");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let releaseDateValue = inputReleaseDate.value;
    let genreValue = inputGenre.value;

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        release_date: releaseDateValue,
        genre: genreValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle.value = '';
            inputReleaseDate.value = '';
            inputGenre.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("movie-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let movie_idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let releaseDateCell = document.createElement("TD");
    let genreCell = document.createElement("TD");

    // Fill the cells with correct data
    movie_idCell.innerText = newRow.movie_id;
    titleCell.innerText = newRow.movie_title;
    releaseDateCell.innerText = newRow.release_date;
    genreCell.innerText = newRow.genre;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(movie_idCell);
    row.appendChild(titleCell);
    row.appendChild(releaseDateCell);
    row.appendChild(genreCell);
    row.appendChild(deleteCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}