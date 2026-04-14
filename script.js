const apiKey ="844cbc60abab7c606af23048579b0789";
const unsplashKey="EEK4_leq2EyQWZpiUHGbGzJCwnOtg1yPHAYOr9_AQ1Q";

// DATE & TIME
function updateDateTime(){
let now = new Date();

document.getElementById("currentDate").innerText =
now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});

document.getElementById("currentTime").innerText =
now.toLocaleTimeString();
}
setInterval(updateDateTime,1000);
updateDateTime();


// MAIN WEATHER
async function getWeather(){

try{

let city = document.getElementById("city").value.trim();

if(city===""){
alert("Enter city name");
return;
}

// SAVE CITY
localStorage.setItem("city", city);

let res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
);

let data = await res.json();

if(data.cod != 200){
alert("Error: " + data.message);
return;
}

// UI UPDATE
document.getElementById("cityName").innerText = data.name;
document.getElementById("temp").innerText = Math.round(data.main.temp)+"°C";
document.getElementById("desc").innerText = data.weather[0].description;

document.getElementById("humidity").innerText = data.main.humidity+"%";
document.getElementById("wind").innerText = data.wind.speed+" km/h";
document.getElementById("pressure").innerText = data.main.pressure+" hPa";

// ICON
document.getElementById("icon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

// SUN
document.getElementById("sunrise").innerText =
new Date(data.sys.sunrise*1000).toLocaleTimeString();

document.getElementById("sunset").innerText =
new Date(data.sys.sunset*1000).toLocaleTimeString();

// EXTRA
loadCityImage(city);
getAQI(data.coord.lat, data.coord.lon);
getForecast(city);

}catch(error){
console.log(error);
alert("Something went wrong!");
}

}


// FORECAST
async function getForecast(city){

try{

let res = await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
);

let data = await res.json();

let html="";

for(let i=0;i<40;i+=8){

let item = data.list[i];

let day = new Date(item.dt_txt)
.toLocaleDateString("en-US",{weekday:"short"});

html += `
<div class="forecast-card">
<p>${day}</p>
<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
<h4>${Math.round(item.main.temp)}°C</h4>
</div>
`;
}

document.getElementById("forecast").innerHTML = html;

}catch(err){
console.log(err);
}

}


// CITY IMAGE
async function loadCityImage(city){

try{
let res = await fetch(
`https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashKey}`
);

let data = await res.json();

document.getElementById("cityImage").src = data.urls.regular;

}catch{
document.getElementById("cityImage").src = "";
}

}


// AQI
async function getAQI(lat, lon){

try{

let res = await fetch(
`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
);

let data = await res.json();

let aqi = data.list[0].main.aqi;

let status = ["Good","Fair","Moderate","Poor","Very Poor"];

document.getElementById("aqi").innerText =
aqi + " (" + status[aqi-1] + ")";

}catch(err){
console.log(err);
}

}


// LOCATION
function getLocationWeather(){

navigator.geolocation.getCurrentPosition(async pos => {

let lat = pos.coords.latitude;
let lon = pos.coords.longitude;

let res = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
);

let data = await res.json();

document.getElementById("city").value = data.name;
getWeather();

});
}


// AUTO LOAD
window.onload = function(){
let savedCity = localStorage.getItem("city");
if(savedCity){
document.getElementById("city").value = savedCity;
getWeather();
}
};