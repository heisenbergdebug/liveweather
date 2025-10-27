// ==== CONFIGURATION ====
const API_KEY = "YOUR_API_KEY_HERE"; // <-- Replace with your OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ==== DOM ELEMENTS ====
const searchInput = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");
const weatherIcon = document.querySelector(".weather-icon");
const temp = document.querySelector(".current-weather h1");
const feelsLike = document.querySelector(".current-weather p:nth-of-type(1)");
const desc = document.querySelector(".desc");
const locationText = document.querySelector(".location p");
const dateText = document.querySelector(".location span");
const info = document.querySelector(".info");

// ==== EVENT LISTENERS ====
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Pressing Enter also triggers search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ==== MAIN FUNCTION ====
async function fetchWeather(city) {
  try {
    const res = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await res.json();

    if (data.cod === "404") {
      alert("City not found 😕");
      return;
    }

    updateUI(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

// ==== UPDATE DASHBOARD ====
function updateUI(data) {
  const { name, sys, main, weather, wind } = data;

  temp.textContent = `${Math.round(main.temp)}°C`;
  feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}°C`;
  desc.textContent = `🌦 ${weather[0].description}`;
  locationText.textContent = `${name}, ${sys.country}`;
  dateText.textContent = formatDate(new Date());

  // Update info section
  info.innerHTML = `
    <p>Sunrise: <span>${formatTime(sys.sunrise)}</span></p>
    <p>Sunset: <span>${formatTime(sys.sunset)}</span></p>
    <p>Humidity: <span>${main.humidity}%</span></p>
    <p>Pressure: <span>${main.pressure} hPa</span></p>
    <p>Wind Speed: <span>${wind.speed} m/s</span></p>
  `;

  // Change weather icon dynamically
  const iconCode = weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Change background color based on temp
  updateBackground(main.temp);
}

// ==== HELPER FUNCTIONS ====
function formatDate(date) {
  const options = { weekday: "long", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

function formatTime(unixTime) {
  const date = new Date(unixTime * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function updateBackground(temp) {
  const body = document.body;
  if (temp < 10) {
    body.style.background = "linear-gradient(135deg, #89f7fe, #66a6ff)";
  } else if (temp >= 10 && temp < 25) {
    body.style.background = "linear-gradient(135deg, #9cd2f5, #bce1ff)";
  } else {
    body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
  }
  body.style.backgroundSize = "400% 400%";
  body.style.animation = "gradientFlow 12s ease infinite";
}
