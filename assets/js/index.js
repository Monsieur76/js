"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { getVideo, getVideoSelectALL } from "../../conf/js/configuration.js";

const pageContent = document.querySelector("[page-content]");
const film_pop = 'Films les plus populaires';
const film_note = 'Films les mieux notés';

sidebar();

// Home page sections (Top rated, Upcoming, Trending movies)
const homePageSections = [
  {
    title: "Films les mieux notés",
    path: "/movie/top_rated",
  },
  {
    title: "Films les plus populaires",
    path: "/trending/movie/week",
  },
];

// fetch all genre then change genre format
// [ { "id": "123", "name": "Action" } ] --> { 123: "Action" }

const genreList = {
  // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // this == genreList;
    }

    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=fr-FR&include_adult=true`,
  function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    getVideo(false,true,false,(data)=>{
      heroBanner(data)
  });
});


// HERO BANNER
const heroBanner = function (data) {
  fetchDataFromServer(
    `https://api.themoviedb.org/3/search/movie?query=${data.title}&api_key=${api_key}&language=fr-FR`,
    ({ results: movieList }) => {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
      <div class="banner-slider"></div>
      
      <div class="slider-control">
        <div class="control-inner"></div>
      </div>
    `;

    let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
        const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");


    sliderItem.innerHTML = `
        <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${
      index === 0 ? "eager" : "lazy"
    }>
        
        <div class="banner-content">
        
          <h2 class="heading">${title}</h2>
        
          <div class="meta-list">
            <div class="meta-item">${
              release_date?.split("-")[0] ?? "Not Released"
            }</div>
        
            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
          </div>
        
          <p class="genre">${genreList.asString(genre_ids)}</p>
        
          <p class="banner-text">${overview}</p>
        
          <a id="id_movie" href="./detail.html" class="btn" onclick="getMovieDetail(${data.id})">
            <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
        
            <span class="span">Regarder Maintenant</span>
          </a>
        
        </div>
      `;
    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
        <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
      `;
    banner.querySelector(".control-inner").appendChild(controlItem);
  }


  pageContent.appendChild(banner);

  addHeroSlide();

  // fetch data for home page sections (top rated, upcoming, trending)
  for (const { title, path } of homePageSections) {
    getVideoSelectALL(true,(data)=>{
      ` configURL + "api.php"`,
      createMovieList(data,title)
    });
  }
})};

// HERO SLIDER
const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");
  //activating the first movie slide

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // `this` == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function (data,title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;
  console.log(data);
  if (title === film_pop){
    data.sort(function compare(a, b) {
      if (a.popularity > b.popularity)
         return -1;
      if (a.popularity < b.popularity )
         return 1;
      return 0;
    });

  }else if(title === film_note ){
    data.sort(function compare(a, b) {
      if (a.vote_average > b.vote_average)
         return -1;
      if (a.vote_average < b.vote_average )
         return 1;
      return 0;
    });
  }

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of data) {
    const movieCard = createMovieCard(movie); // called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

search();
