// Get the objects we need to modify
let updateMovieForm = document.getElementById('update-movie-form-ajax');

// Modify the objects we need
updateMovieForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    let inputMovieId = document.getElementById("movieSelect");
    let inputTitle = document.getElementById("update-movie");
    // Get form fields we need to get data from
    let inputReleaseDate = document.getElementById("input-release_date-update");
    let inputGenre = document.getElementById("input-genre-update");

    // Get the values from the form fields
    let movieIdValue = inputMovieId.value;
    let movieTitleValue = inputTitle.value;
    let releaseDateValue = inputReleaseDate.value;
    let movieGenreValue = inputGenre.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // if (isNaN(homeworldValue)) 
    // {
    //     return;
    // }


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
            updateRow(xhttp.response, releaseDateValue);
            updateRow(xhttp.response, movieGenreValue);

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
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == movieID) {

            // Get the location of the row where we found the matching movie ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].movie_title;
       }
    }
}