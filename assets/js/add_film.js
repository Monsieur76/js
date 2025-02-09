const configURL = "http://localhost/nectflix/api/";
const api_key = "314876e822f63937379d8c1e437ceea3";
const imageBaseURL = "https://image.tmdb.org/t/p/";



const pageContent = document.querySelector("[page-content2]");

//sidebar();


function add_film(name)
    {
        let error = document.getElementById('error');
        if (error.innerText !== ""){
            error.innerHTML = "";
        }
        getVerification(name,(data)=>{
            if (data.title === name){
                error.innerHTML = "Le film est déjà présent sur le site";
            }else{
                register_film(name)
            }
        })

    }

function register_film(name)
{
    fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${name}&page=1&include_adult=true&language=fr-FR&region=FR`,
        moovie
    )
}

const moovie = function ({ results: movieList }) {
    let select = document.getElementById('selectElementId');
    let options = select.getElementsByTagName('option');
    let a = 0;

    for (var i=options.length; i--;) {
        select.removeChild(options[i]);
    }

      for (const movie of movieList) {
        let option = document.createElement('option');
        option.value = a;
        option.innerHTML = movie.title;
        option.style.background = "#1a1820";
        select.appendChild(option);
        a++;
      }

};

function addtitle(index)
{
    let error = document.getElementById('error');
    if (error.innerText !== ""){
        error.innerHTML = "";
    }
    getVerification(document.getElementById("selectElementId").options[index].innerText,(data)=>{
        if (data.title === document.getElementById("selectElementId").options[index].innerText){
            error.innerHTML = "Le film est déjà présent sur le site";
        }else{
            document.getElementById('nom').value = document.getElementById("selectElementId").options[index].innerText;
            fetchDataFromServer(
                `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${document.getElementById("selectElementId").options[index].innerText}&page=1&include_adult=false&language=fr-FR`,
                function ({ results: movieList }) {
                    document.getElementById('title').value = movieList[0].title;
                    document.getElementById('vote_average').value = movieList[0].vote_average;
                    document.getElementById('release_date').value = movieList[0].release_date;
                    document.getElementById('poster_path').value = movieList[0].poster_path;
                    document.getElementById('popularity').value = movieList[0].popularity;
                    document.getElementById('overview').value = movieList[0].overview;
                    document.getElementById('genre_ids').value = movieList[0].genre_ids;
                }
            )
        }
    })
}

async function getVerification(nametitle, cb) {
    const response = await fetch(configURL+"api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ veriftitle: nametitle }) ,
    })
    .then(response=>response.json())
    .then((data) => cb(data))
    .catch(error=>console.error(error));
}

const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => callback(data, optionalParam));
  };



















  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=fr-FR`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>
    </div>
    <div class="sidebar-list">
      <p class="title">Language</p>

      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=en", "English")'>English</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=zh", "Mandarin")'>Mandarin</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=ms", "Malay")'>Malay</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=fr", "Français")'>Français</a>
    </div>



    <div class="sidebar-footer">
      <p class="copyright">
        Copyright 2025
        <a href="https://www.linkedin.com/in/gaetan-henry-a305b516a/" target="_blank">Monsieur</a>
      </p>
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    // toggle sidebar in mobile screen
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };