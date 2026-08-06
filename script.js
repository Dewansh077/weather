const apiKey = "bbd013214cafe4399817a1ff961e1d64";

const cityInput = document.getElementById("city");

const weatherContent = document.getElementById("weatherContent");
const weatherHeading = document.getElementById("weatherHeading");

const tempCard = document.getElementById("tempCard");
const humidityCard = document.getElementById("humidityCard");
const windCard = document.getElementById("windCard");

const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");
const weatherIcon = document.getElementById("weatherIcon");

const errorMessage = document.getElementById("errorMessage");

async function updateCityWeather(city) {

    try {

        const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoResponse.ok || geoData.length === 0) return;

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const weatherResponse = await fetch(weatherURL);
        const weather = await weatherResponse.json();

        if (!weatherResponse.ok) return;

        const id = city.toLowerCase();

        document.getElementById(id + "Temp").textContent =
            `${Math.round(weather.main.temp)} °C`;

        document.getElementById(id + "Humidity").textContent =
            `${weather.main.humidity}%`;

        document.getElementById(id + "Weather").textContent =
            weather.weather[0].main;

    } catch (error) {

        console.error(`Error loading ${city}:`, error);

    }

}
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    try {

        hideError();

        const geoURL =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;

        const geoResponse = await fetch(geoURL);

        const geoData = await geoResponse.json();

        if (!geoResponse.ok) {
            showError(geoData.message || "Unable to find city.");
            return;
        }

        if (geoData.length === 0) {
            showError("City not found. Please enter a valid city.");
            return;
        }

        const latitude = geoData[0].lat;
        const longitude = geoData[0].lon;

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        const weatherResponse = await fetch(weatherURL);

        const weather = await weatherResponse.json();

        if (!weatherResponse.ok) {
            showError(weather.message || "Unable to get weather data.");
            return;
        }

        weatherContent.classList.remove("d-none");

        weatherHeading.textContent =
            `Weather for ${weather.name}, ${weather.sys.country}`;

        tempCard.textContent =
            `${Math.round(weather.main.temp)} °C`;

        humidityCard.textContent =
            `${weather.main.humidity}%`;

        windCard.textContent =
            `${weather.wind.speed} m/s`;

        description.textContent =
            weather.weather[0].description;

        feelsLike.textContent =
            `Feels like: ${Math.round(weather.main.feels_like)} °C`;

        pressure.textContent =
            `Pressure: ${weather.main.pressure} hPa`;

        const iconCode = weather.weather[0].icon;

        weatherIcon.src = "";
        weatherIcon.textContent = "";

        const icon = document.createElement("img");

        icon.src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        icon.alt =
            weather.weather[0].description;

        weatherIcon.appendChild(icon);

    } catch (error) {

        console.error(error);

        showError(
            "Something went wrong. Please check your internet connection."
        );
    }
}
const cities = [
    "Delhi",
    "Mumbai",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Jaipur"
];
function refreshWeather() {

    if(cityInput.value.trim() !== ""){
        getWeather();
    }

}
cities.forEach(updateCityWeather);

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("d-none");

    weatherContent.classList.add("d-none");
}

function clearWeather(){

    cityInput.value = "";

    weatherContent.classList.add("d-none");

}
function hideError() {

    errorMessage.classList.add("d-none");
}
function getLocationWeather() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        showPosition,
        showError
    );

}
async function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    const weather = await response.json();

    weatherContent.classList.remove("d-none");

    weatherHeading.textContent =
        `Weather for ${weather.name}, ${weather.sys.country}`;

    tempCard.textContent =
        `${Math.round(weather.main.temp)} °C`;

    humidityCard.textContent =
        `${weather.main.humidity}%`;

    windCard.textContent =
        `${weather.wind.speed} m/s`;

    description.textContent =
        weather.weather[0].description;

    feelsLike.textContent =
        `Feels like ${Math.round(weather.main.feels_like)} °C`;

    pressure.textContent =
        `Pressure: ${weather.main.pressure} hPa`;

    weatherIcon.innerHTML =
        `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`;
}

cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});