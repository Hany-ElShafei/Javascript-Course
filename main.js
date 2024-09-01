//#region HTML Elements
const btnOpenMenu = document.getElementById("open-nav-menu");
const btnCloseMenu = document.getElementById("close-nav-menu");
const divMenu = document.getElementsByClassName("wrapper");
const greetingMessage = document.getElementById("greeting");
const hoursHolder = document.querySelector("span[data-time=hours]");
const minutesHolder = document.querySelector("span[data-time=minutes]");
const secondsHolder = document.querySelector("span[data-time=seconds]");
const weatherText = document.getElementById("weather");
const celsiusOption = document.getElementById("celsius");
const fahrOption = document.getElementById("fahr");
const imgs0 = document.querySelector("#gallery > [alt='image 1']");
const imgs1 = document.querySelector(
  "#gallery > .thumbnails > [alt='Thumbnail Image 1']"
);
const imgs2 = document.querySelector(
  "#gallery > .thumbnails > [alt='Thumbnail Image 2']"
);
const imgs3 = document.querySelector(
  "#gallery > .thumbnails > [alt='Thumbnail Image 3']"
);
let weatherInCelsius, weatherInFahrenheit, spanTemp, spanTempUnit;
//#endregion

// #region Menu
btnOpenMenu.addEventListener("click", function () {
  divMenu[0].classList.add("nav-open");
});
btnCloseMenu.addEventListener("click", function () {
  divMenu[0].classList.remove("nav-open");
});
//#endregion

//#region Updating Greeting Message & Local Time
setInterval(() => {
  //#region Greeting Message
  let localTime = new Date();
  let hours = localTime.getHours();
  if (hours >= 0 && hours < 12) {
    greetingMessage.innerText = "Good Morning!";
  } else if (hours >= 12 && hours < 18) {
    greetingMessage.innerText = "Good Afternoon!";
  } else if (hours >= 18 && hours < 22) {
    greetingMessage.innerText = "Good Evening!";
  } else if (hours >= 22) {
    greetingMessage.innerText = "Good Night!";
  } else {
    greetingMessage.innerText = "Invalid Hour!";
  }
  //#endregion

  //#region Local Time
  let minutes = localTime.getMinutes();
  let seconds = localTime.getSeconds();
  hoursHolder.innerText = hours.toString().padStart(2, "0");
  minutesHolder.innerText = minutes.toString().padStart(2, "0");
  secondsHolder.innerText = seconds.toString().padStart(2, "0");
  //#endregion
}, 1000);
//#endregion

//#region Getting Geo Location
// Step 1: Get user coordinates
function getCoordintes() {
  var options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude.toString();
    var lng = crd.longitude.toString();
    var coordinates = [lat, lng];
    getCity(coordinates);
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
  var xhr = new XMLHttpRequest();
  var lat = coordinates[0];
  var lng = coordinates[1];

  // Paste your LocationIQ token below.
  xhr.open(
    "GET",
    "https://us1.locationiq.com/v1/reverse.php?key=pk.80fca86962fdf241af4514a459d921bd&lat=" +
      lat +
      "&lon=" +
      lng +
      "&format=json",
    true
  );
  xhr.send();
  xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      var city = response.address.city;
      countryCode = response.address.country_code;

      const base = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&APPID=127881d6fad5b6a5f33704d6d74b7e3d`;

      fetch(base)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          weatherInCelsius = Math.floor(data.main.temp - 273);
          weatherInFahrenheit = Math.floor((weatherInCelsius * 9) / 5 + 32);
          weatherText.innerHTML = `The weather is ${data.weather[0].main
            .toString()
            .toLowerCase()} in ${city} and it's <span id='spanTemp'>${weatherInCelsius}</span>°<span id='spanTempUnit'>C</span> outside.`;
          spanTemp = document.getElementById("spanTemp");
          spanTempUnit = document.getElementById("spanTempUnit");
        });
    }
  }
}

getCoordintes();

//#endregion

//#region Switching Temp
fahrOption.addEventListener("change", () => {
  spanTemp.innerText = weatherInFahrenheit;
  spanTempUnit.innerText = "F";
});
celsiusOption.addEventListener("change", () => {
  spanTemp.innerText = weatherInCelsius;
  spanTempUnit.innerText = "C";
});
//#endregion

//#region Select images

imgs1.addEventListener("click", () => {
  imgs0.setAttribute("src", "./assets/gallery/image1.jpg");
  imgs1.setAttribute("data-selected", "true");
  imgs2.setAttribute("data-selected", "false");
  imgs3.setAttribute("data-selected", "false");
});

imgs2.addEventListener("click", () => {
  imgs0.setAttribute("src", "./assets/gallery/image2.jpg");
  imgs1.setAttribute("data-selected", "false");
  imgs2.setAttribute("data-selected", "true");
  imgs3.setAttribute("data-selected", "false");
});

imgs3.addEventListener("click", () => {
  imgs0.setAttribute("src", "./assets/gallery/image3.jpg");
  imgs1.setAttribute("data-selected", "false");
  imgs2.setAttribute("data-selected", "false");
  imgs3.setAttribute("data-selected", "true");
});

//#endregion
