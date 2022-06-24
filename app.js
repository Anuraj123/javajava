
// App data
const weather = {};

const location1 = {};

const timeDetails={};
weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEYS
const key = "82005d27a116c2880c8f0fcb866998a0";
const lnkey="4c9adddc069e9c7b20cd576d929f7ddf";
var day_detail;
var month_detail;
var date_detail;
var year_detail;
var CityName="";
var result="";
function getInputValue(){
    // Selecting the input element and get its value 
     CityName = document.getElementById("myInput").value;
     console.log(CityName);
     notificationElement.style.display = "";
            notificationElement.innerHTML = "";     
     check();
}
// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const dayElement = document.querySelector(".day p");
const timeElement = document.querySelector(".time p");

check();

function getLatLong(CityName)
{
    let api=`http://api.openweathermap.org/geo/1.0/direct?q=${CityName}&appid=${lnkey}`;

    fetch(api)
    .then(function(response){
        let data = response.json();
        return data;
    })  
    .then(function(data){
        if(data.length==0)
        {
            iconElement.innerHTML = `<img src=${"icons/unknown.png"} alt="">`;
    tempElement.innerHTML = `- °<span>C</span>`;
    descElement.innerHTML = `<p> - </p>`;
    locationElement.innerHTML = `<p> - </p>`;
            notificationElement.style.display = "block";
            notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";     
            dayElement.innerHTML=`<p>----</p>`;
            timeElement.innerHTML=`<p>---</p>`
        }
        else{

            location1.latitude = data[0].lat;
            location1.longitude = data[0].lon;
            getWeather(location1.latitude, location1.longitude);
        } 
    })
}
// CHECK IF BROWSER SUPPORTS GEOLOCATION
console.log(CityName.length);
function check()
{
    if(CityName.length!=0)
    {
        getLatLong(CityName);
    }
    else if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }
}


// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        
        .then(function(){
            Times(latitude, longitude);
        });
}
function Times(latitude, longitude)
{
    let api =`http://api.timezonedb.com/v2.1/get-time-zone?key=8XS9P0YNM44D&format=json&by=position&lat=${latitude}&lng=${longitude}`;
    fetch(api)
        .then(function(response){
            let data = response.json();
            
            return data;
        })
        .then(function(data)
        {
            str=data.formatted;
 result = str.trim().split(/\s+/);
const dayN=new Date(result[0]);
const days=['  ','Monday','Tuesday','Wednesday','Thursday','Friday','Satuarday','Sunday'];
     day_detail=days[dayN.getDay()];   

const months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
month_detail=months[dayN.getMonth()];
date_detail=dayN.getDate();
year_detail=dayN.getFullYear();
})

        .then(function(){
            displayWeather();
        })
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    dayElement.innerHTML=`${day_detail}, ${date_detail}/${month_detail}/${year_detail}`;
    timeElement.innerHTML=`<p>${result[1].slice(0,result[1].length-3)}</p>`
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

