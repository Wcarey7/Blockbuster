// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


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


// Update frontend with new row
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
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    movie_idCell.innerText = newRow.movie_id;
    titleCell.innerText = newRow.movie_title;
    releaseDateCell.innerText = newRow.release_date;
    genreCell.innerText = newRow.genre;

    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function(){
        deleteMovie(newRow.movie_id);
    };

    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    row.appendChild(movie_idCell);
    row.appendChild(titleCell);
    row.appendChild(releaseDateCell);
    row.appendChild(genreCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.movie_id);
    
    // Add the row to the table
    currentTable.appendChild(row);


    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu 
    // so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("update-movie");
    let option = document.createElement("option");
    option.text = newRow.movie_title;
    option.value = newRow.movie_id;
    selectMenu.add(option);
}
