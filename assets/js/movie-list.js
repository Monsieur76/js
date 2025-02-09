"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { getVideo, getVideoSelectALL } from "../../conf/js/configuration.js";



const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;

getVideoSelectALL(true,(data)=>{
  ` configURL + "api.php"`,
  createMovieList(data)
});

const createMovieList = function (data) {
    let urlid = urlParam.split("with_genres=");
    document.title = `${genreName} Movies - Nectflix`;

    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");
    movieListElem.ariaLabel = `${genreName} Movies`;

    movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h1 class="heading">All ${genreName} Movies</h1>
    </div>
    
    <div class="grid-list"></div>
    
    <button class="btn load-more" load-more>Voir plus</button>
  `;

    // add movie card based on fetched item
    for (const movie of data) {
      let genre = movie.genre_ids.split("\"");
      let id = genre[1];
      genre = id.split(",");
      for (const genres of genre) {
        if (urlid[1] ===genres ){
          const movieCard = createMovieCard(movie);
          movieListElem.querySelector(".grid-list").appendChild(movieCard);
        }
      }
    }

    pageContent.appendChild(movieListElem);

    // load more button
    /*document
      .querySelector("[load-more]")
      .addEventListener("click", function () {
        if (currentPage >= totalPages) {
          this.style.display = "none"; // this == loading-btn
          return;
        }

        currentPage++;
        this.classList.add("loading"); // this == loading-btn

       /* fetchDataFromServer(
          `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=true&page=${currentPage}&${urlParam}&language=fr-FR`,
          ({ results: movieList }) => {
            this.classList.remove("loading"); // this == loading-btn

            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);

              movieListElem.querySelector(".grid-list").appendChild(movieCard);
            }
          }
        );
      });*/
}


search();