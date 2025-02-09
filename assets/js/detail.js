"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { configURL, getVideo } from "../../conf/js/configuration.js";


const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");
const Url_thbm = 'https://image.tmdb.org/t/p/original';
const Source_video = 'http://localhost/nectflix/video/tmp/';

console.log(movieId);

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }

  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);

  return directorList.join(", ");
};

getVideo(false,false,movieId,(data)=>{
  ` configURL + "api.php"`,
  createMovieList(data)
});


const createMovieList = function (data) {

  console.log(data);

    document.title = `${data.title} - Nectflix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${Url_thbm}${data.poster_path}')"></div>
    
    <figure class="poster-box movie-poster">
      <img src="${Url_thbm}${data.poster_path}" alt="${data.title} poster" class="img-cover">
    </figure>
    
    <div class="detail-box">
    
      <div class="detail-content">
        <h1 class="heading">${data.title}</h1>
    
        <div class="meta-list">
    
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
    
            <span class="span">${data.vote_average.toFixed(1)}</span>
          </div>
            
          <div class="separator"></div>
    
          <div class="meta-item">${
            data.release_date?.split("-")[0] ?? "Not Released"
          }</div>
        
        </div>
  
    
        <p class="overview">${data.overview}</p>
    
      </div>
    
      <div class="title-wrapper">
        <h3 class="title-large">Film</h3>
      </div>
    
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    
    </div>
  `;

      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

          //vidéo 
      videoCard.innerHTML = `
      <embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org"
       width="640"
       height="480"
       id="vlcplayer">
</embed>
      <video id="my-video" class="video-js vjs-default-skin" controls preload="auto" width="500" height="294">
          <source src="${Source_video}${data.hash}" autoplay type='video/mp4'>
          <!-- Si le format vidéo n'est pas pris en charge -->
          Votre navigateur ne prend pas en charge la vidéo HTML5.
      </video>
    `;


      movieDetail.querySelector(".slider-inner").appendChild(videoCard);

    pageContent.appendChild(movieDetail);

};


const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
      </div>
      
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};


//getVideo()

search();
