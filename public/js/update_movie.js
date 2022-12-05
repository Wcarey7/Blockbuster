// Code Citations
// Date: 11/15/2022
// Referenced structure and AJAX request from:
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


let updateMovieForm = document.getElementById('update-movie-form-ajax');

updateMovieForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    let inputMovieId = document.getElementById("update-movie");
    let inputTitle = document.getElementById("update-title");
    let inputReleaseDate = document.getElementById("input-release_date-update");
    let inputGenre = document.getElementById("input-genre-update");

    // Get the values from the form fields
    let movieIdValue = inputMovieId.value;
    let movieTitleValue = inputTitle.value;
    let releaseDateValue = inputReleaseDate.value;
    let movieGenreValue = inputGenre.value;


    // Put our data we want to send in a javascript object
    let data = {
        movieId: movieIdValue,
        movie_title: movieTitleValue,
        release_date: releaseDateValue,
        genre: movieGenreValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-movie-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, movieIdValue);

            // Clear the input fields
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


function updateRow(data, movieID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("movie-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == movieID) {

            // Get the location of the row where we found the matching movie ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of value
            let movieTitle = updateRowIndex.getElementsByTagName("td")[1];
            let releaseDate = updateRowIndex.getElementsByTagName("td")[2];
            let genre = updateRowIndex.getElementsByTagName("td")[3];

            // Set to what row to update
            let tableRow = i-1;

            // Reassign the value we updated to
            movieTitle.innerHTML = parsedData[tableRow].movie_title;
            releaseDate.innerHTML = parsedData[tableRow].release_date;
            genre.innerHTML = parsedData[tableRow].genre;

            // Remove the name from the dropdown menu   
            deleteDropDownMenu(movieID);

            // Add updated name to dropdown menu
            let selectMenu = document.getElementById("update-movie");
            let option = document.createElement("option");
            option.text = parsedData[tableRow].movie_title;
            option.value = movieID
            selectMenu.add(option);
       }
    }
}


function deleteDropDownMenu(movieID){
    let selectMenu = document.getElementById("update-movie");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(movieID)){
        selectMenu[i].remove();
        break;
      }  
    }
}


// Fill update html form on selection change
function autoFill() {
    let selectElement = document.getElementById('update-movie');
    let selectElement_id = selectElement.value;

    // If the element selected is empty, clear all values in the form
    if (selectElement_id === '') {
        document.getElementById("update-title").value = ''
        document.getElementById("input-release_date-update").value = ''
        document.getElementById("input-genre-update").value = ''

    } else {
        let table = document.getElementById('movie-table');
        // Fill each form field with the selected customers info
        for (let i = 0, row; row = table.rows[i]; i++) {

            if (table.rows[i].getAttribute('data-value') == selectElement_id) {

                let updateRowIndex = table.getElementsByTagName("tr")[i];

                let td1 = updateRowIndex.getElementsByTagName("td")[1];
                document.getElementById('update-title').value = td1.innerHTML;

                let td2 = updateRowIndex.getElementsByTagName("td")[2];
                document.getElementById('input-release_date-update').value = td2.innerHTML;

                let td3 = updateRowIndex.getElementsByTagName("td")[3];
                document.getElementById('input-genre-update').value = td3.innerHTML;

            }
        }
    }
}
