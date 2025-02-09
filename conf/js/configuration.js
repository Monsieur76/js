const configURL = "http://localhost/nectflix/api/";


/*async function getVideoPost() {
  try {
    const url = configURL+"api.php";
    const response = await fetch(url);
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}*/

async function getVideoPost(nametitle,callback, optionalParam) {
  fetch(configURL+"api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: nametitle }) ,
  })
  
  .then(response=>response.json())
  .then((data) => callback(data, optionalParam))
  .catch(error=>console.error(error));
}






async function getVideo(nametitle = false,last = false, id = false , cb) {
    const response = await fetch(configURL+"api.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nametitle, date: last, id: id }) ,
    })
    .then(response=>response.json())
    .then((data) => cb(data))
    .catch(error=>console.error(error));
}


async function getVideoSelectALL(top_rated = false, cb) {
  const response = await fetch(configURL+"api.php", {
    method: "POST",
    body: JSON.stringify({ top_rated: top_rated }) ,
  })
  .then(response=>response.json())
  .then((data) => cb(data))
  .catch(error=>console.error(error));
}




export {configURL, getVideo, getVideoSelectALL};