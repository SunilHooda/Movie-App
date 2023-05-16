const api_Key = "187bd7eac6a993784bcfde66eb195472";
const image_path = `https://image.tmdb.org/t/p/w1280`;

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");

let favoriteMovies;
function fetchFavoriteMoviesFromLS() {
  favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
}
fetchFavoriteMoviesFromLS();

//Capturing Search Input Query
async function main() {
  let query = document.getElementById("search").value;
  let data = await getMovieBySearch(query);
  //console.log(data);

  //Closing Result Section if query length is 0 else showing.
  if (query.length === 0) {
    document.querySelector(".searchMoviesContainer").style.display = "none";
  } else {
    document.querySelector(".searchMoviesContainer").style.display = "flex";
  }

  appendSearchMovie(data);
}

async function getMovieBySearch(query) {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_Key}&query=${query}`;

  let res = await fetch(url);
  let data = await res.json();
  //console.log(data);
  return data.results;
}

//Debouncing api calling by 1000ms
let id;
function debounce(func, delay) {
  if (id) {
    clearTimeout(id);
  }
  id = setTimeout(function () {
    func();
  }, delay);
}

//Appending Searched Movies
function appendSearchMovie(data) {
  let container = document.querySelector(".searchMovies");
  container.innerHTML = null;

  if (!data || data.length === 0) {
    return (container.innerHTML = `<h2>No movies found...</h2>`);
  }

  data.forEach(function (el) {
    let div = document.createElement("div");
    div.setAttribute("class", "movie");
    div.setAttribute("id", "movie-card");
    div.style.cursor = "pointer";

    div.addEventListener("click", function () {
      showPopUp(el);
    });

    let img = document.createElement("img");
    img.src = `${image_path}` + el.poster_path;

    let InfoDiv = document.createElement("div");
    InfoDiv.setAttribute("class", "movie-Info");

    let title = document.createElement("h3");
    title.innerText = el.title;

    let rating = document.createElement("p");
    rating.innerText = `Rating :- ${el.vote_average.toFixed(1)}/10`;

    let releaseDate = document.createElement("p");
    releaseDate.innerText = `Release Date :- ${el.release_date}`;

    InfoDiv.append(title, rating, releaseDate);
    div.append(img, InfoDiv);
    container.style.height = "400px";
    container.style.overflowY = "scroll";
    container.append(div);
  });
}

//Closing Result Section
const closeResult = document.querySelector(".result-head > h2");
closeResult.addEventListener("click", () => {
  document.querySelector(".searchMoviesContainer").style.display = "none";
  document.getElementById("search").value = "";
});

//Closing Favorites Section
const closeFavorites = document.querySelector(".section-head > h2");
closeFavorites.addEventListener("click", () => {
  document.querySelector("#favorites").style.display = "none";
});

//Showing Favourites Section
const showFavorites = document.querySelector("#showFavorites");
showFavorites.addEventListener("click", () => {
  document.querySelector("#favorites").style.display = "block";
});

//Showing the popup when we click on any movie card
async function getMovieById(id) {
  let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_Key}`;

  let res = await fetch(url);
  let data = await res.json();
  //console.log(data);
  return data;
}

async function getMovieTrailerById(id) {
  let url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_Key}`;
  try {
    let res = await fetch(url);
    let data = await res.json();
    //console.log(data.results[0].key);
    return data.results[0].key;
  } catch (error) {
    return "FlFyrOEz2S4";
  }
}

async function showPopUp(card) {
  //console.log(card);
  const popUpContainer = document.querySelector(".popUp-container");
  popUpContainer.innerHTML = null;

  popUpContainer.classList.add("show-popup");

  const movieId = card.id;
  const movie = await getMovieById(movieId);
  const movieTrailer = await getMovieTrailerById(movieId);
  //console.log(movieId,movie, movieTrailer);

  popUpContainer.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${
    image_path + movie.poster_path
  })`;

  popUpContainer.innerHTML = `
      <span class="x-icon">&#10006;</span>
      <div class="content">
        <!--Left Side for Poster Image and Add to favorite Icon-->
        <div class="left">
          <div class="poster-img">
            <img src="${image_path + movie.poster_path}" alt="" />
          </div>
          <div class="single-info">
            <span>Add to Favorites:</span>
            <!-- Using unicode for heart Icon -->
            <span class="heart-icon">&#9829;</span>
          </div>
        </div>

        <!--Right Side for additional info about movie-->
        <div class="right">
          <h1>${movie.title}</h1>
          <h3>${movie.tagline}</h3>
          <div class="single-info-container">
            <div class="single-info">
              <span>Language:</span>
              <span>${movie.spoken_languages[0].name}</span>
            </div>
            <div class="single-info">
              <span>Length:</span>
              <span>${movie.runtime} minutes</span>
            </div>
            <div class="single-info">
              <span>Rating:</span>
              <span>${movie.vote_average.toFixed(1)} / 10</span>
            </div>
            <div class="single-info">
              <span>Budget:</span>
              <span>$ ${movie.budget}</span>
            </div>
            <div class="single-info">
              <span>Release Date:</span>
              <span>${movie.release_date}</span>
            </div>
          </div>
          <div class="genres">
            <h2>Genres</h2>
            <ul>
            ${movie.genres.map((e) => `<li>${e.name}</li>`).join("")}
            </ul>
          </div>

          <div class="overview">
            <h2>Overview</h2>
            <p>
            ${movie.overview}
            </p>
          </div>

          <div class="trailer">
            <h2>Trailer</h2>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/${movieTrailer}"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
  `;

  /* Closing Popup */
  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () => {
    popUpContainer.classList.remove("show-popup");
    if (dataChanged) {
      window.location.reload();
    }
  });

  /* Adding to local Storage using heart-icon */
  /*Now when we add it to favorites we want the movie to be shown to the favorites section buy we also want it to be saved for other times after we close the browser. For this we will use localStorge.*/

  const heart_icon = popUpContainer.querySelector(".heart-icon");

  let alreadyAdded = favoriteMovies.filter((item) => item.id === movieId);

  if (alreadyAdded.length > 0) {
    heart_icon.classList.add("change-color");
  }

  heart_icon.addEventListener("click", () => {
    /*Now we will check if heart-icon has "change-color" class. If yes remove it and filter lS array else add it and update LS array */
    if (heart_icon.classList.contains("change-color")) {
      localStorage.setItem(
        "favoriteMovies",
        JSON.stringify(favoriteMovies.filter((item) => item.id !== movieId))
      );
      heart_icon.classList.remove("change-color");
      dataChanged = true;
    } else {
      localStorage.setItem(
        "favoriteMovies",
        JSON.stringify([...favoriteMovies, card])
      );
      heart_icon.classList.add("change-color");
      dataChanged = true;
    }
  });
  //fetchFavoriteMoviesFromLS();
}

//Appending Favorite Movies to UI in Favorite Container
function appendFavoriteMovie(data) {
  let container = document.querySelector(".favorites .movies-grid");
  container.innerHTML = null;

  if (!data || data.length === 0) {
    return (container.innerHTML = `<h2>No movies added yet..</h2>`);
  }

  data.forEach(function (el) {
    appendMovieCard(el, container);
  });
}
appendFavoriteMovie(favoriteMovies);

// Trending Movies with pagination

let currentPage = 1;
let nextPage;
let prevPage;
let totalPages = 100;

async function get_trending_movies(page = 1) {
  let url = `https://api.themoviedb.org/3/trending/all/day?api_key=${api_Key}&page=${page}`;

  let res = await fetch(url);
  let data = await res.json();
  //console.log(data);
  appendTrendingMovie(data.results);

  /*Setting pages acording to result */
  currentPage = data.page;
  nextPage = currentPage + 1;
  prevPage = currentPage - 1;

  current.innerText = currentPage;

  /*Disable and Enable clicking on Prev and Next */
  if (currentPage === 1) {
    prev.classList.add("disabled");
    next.classList.remove("disabled");
  } else if (currentPage >= totalPages) {
    prev.classList.remove("disabled");
    next.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
    next.classList.remove("disabled");
  }
}
get_trending_movies();

function appendTrendingMovie(data) {
  let container = document.querySelector(".trending .movies-grid");
  container.innerHTML = null;

  if (!data || data.length === 0) {
    return;
  }

  data.forEach(function (el) {
    appendMovieCard(el, container);
  });
}

function appendMovieCard(el, container) {
  let div = document.createElement("div");
  div.setAttribute("class", "card");

  div.addEventListener("click", function () {
    showPopUp(el);
  });

  let imgDiv = document.createElement("div");
  imgDiv.setAttribute("class", "img");
  let img = document.createElement("img");
  img.src = `${image_path}` + el.poster_path;
  imgDiv.append(img);

  /*Parent Info Div */
  let InfoDiv = document.createElement("div");
  InfoDiv.setAttribute("class", "info");

  let title = document.createElement("h3");
  title.innerText = el.title;

  /*Rating Info Div */
  let singleInfoDiv = document.createElement("div");
  singleInfoDiv.setAttribute("class", "single-info");

  let rate = document.createElement("span");
  rate.innerText = "Rating: ";

  let rating = document.createElement("span");
  rating.innerText = `${el.vote_average.toFixed(1)}/10`;

  singleInfoDiv.append(rate, rating);

  /*Release Date Info Div */
  let singleInfoDiv2 = document.createElement("div");
  singleInfoDiv2.setAttribute("class", "single-info");

  let release = document.createElement("span");
  release.innerText = "Release Date: ";

  let releaseDate = document.createElement("span");
  releaseDate.innerText = `${el.release_date}`;

  singleInfoDiv2.append(release, releaseDate);

  InfoDiv.append(title, singleInfoDiv, singleInfoDiv2);
  div.append(imgDiv, InfoDiv);
  container.append(div);
}

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    get_trending_movies(prevPage);
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    get_trending_movies(nextPage);
  }
});
