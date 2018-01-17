// key for DarkSky  key = a8ea03fa5ce71e002ae2276afd7c5ddb;
//  url = 'https://api.darksky.net/forecast/[key/[latitude],[longitude],[date]',

var KEY_DARK_SKY = 'a8ea03fa5ce71e002ae2276afd7c5ddb',
 KEY_GOOGLE_MAPS= "AIzaSyAfCkfOpv6zYHZjSUWPlkKo8N7FbMzMJik",
 DAY_IN_SECONDS = 86400,
 latitude,
 longitude,
 Date_,
 newDateInSeconds,
 url_forecast,
 timer;

//  set clock todayDate
function setClockForToday() {
 var findTodayDay= moment().format('dddd') +'\n' + moment().format('MMMM Do YYYY') + '\n';
 var findTodayClock = moment().format('h:mm:ss a');
 var $date = document.getElementById('date').innerText = findTodayDay + findTodayClock ;
}

//  yesterday date
function setTimeForYesterday()  {
 var findYesterdayDay= moment().subtract(1,'days').calendar() + '\n'+ moment().subtract(1,'days').format('MMMM Do YYYY');
 var $date = document.getElementById('date').innerText = findYesterdayDay;
}

//  tomorrow date
function setTimeForTomorrow()  {
 var  findTomorrowDay= moment().add(1,'days').calendar() + '\n'+ moment().add(1,'days').format('MMMM Do YYYY');
 var $date = document.getElementById('date').innerText = findTomorrowDay;
}

window.onload = function() {
 setClockForToday();
 timer = setInterval(setClockForToday, 1000);
};

// getting geolocation
function geoLocation() {
 $( "#loading" ).show();
 var notSupport = document.getElementById('notsupport');
 if (!navigator.geolocation) {
  notSupport.innerHTML = '<p>Geolocation is not supported by your' +
   'browser and we can no show your weather</p>';
  return;
 }
 function seccess(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  if(!Date_) {
   defineTodayDate();
  }
  url_forecast = "https://api.darksky.net/forecast/" + KEY_DARK_SKY + "/" + latitude + "," + longitude + "," + Date_;
  forecastRequest(url_forecast);
  console.log('url_forecast' + url_forecast);
  FindCityRequest();
 }
 function error() {
  notSupport.innerHTML = "Unable to retrieve your location and why " +
   "we can`t set your weather";
 }
 navigator.geolocation.getCurrentPosition(seccess, error);
}
geoLocation();

// find latitude and longitude entered city in input
$button = document.getElementById('find-city');
var init = function () {
 $button
  .addEventListener('click', execute);
};

// choose from inputs
function execute() {
 var $findInputCity = document.getElementById('find-input-city');
 var findInputCity = $findInputCity.value;
 if (!findInputCity ) {
  FindInputCityRequest();
 } else
 {
  document.getElementById('found-city').innerText = 'Location : ' +  findInputCity;
  FindInputCityRequest({
   inputCity: findInputCity
  })
 }
}

// getting latitude and longitude  with Request
function FindInputCityRequest(params) {
 $( "#loading" ).show();
 params = params || {};
 params.inputCity = params.inputCity || ' ';

 var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ params.inputCity + "&key=" + KEY_GOOGLE_MAPS;
 var xhr = new XMLHttpRequest;
 xhr.open("GET", url);
 xhr.onreadystatechange = function () {
  if (xhr.readyState === xhr.DONE && xhr.status === 200) {
   parseInfoAboutInputCity(JSON.parse(xhr.responseText));
  }
 };
 xhr.send();
}
init();

//  Determining latitude and longitude entered in input city
function parseInfoAboutInputCity(locationInfoAboutInputCity) {
 //(locationInfo.results[0].address_components);
 var latitude= (locationInfoAboutInputCity.results[0].geometry.location.lat);
 var longitude = (locationInfoAboutInputCity.results[0].geometry.location.lng);
 if(!Date_) {
  defineTodayDate();
 }
 url_forecast = "https://api.darksky.net/forecast/" + KEY_DARK_SKY + "/" + latitude + "," + longitude + "," + Date_;
 forecastRequest(url_forecast);
 console.log('url_forecast' + url_forecast);
}

// getting city with Request
function FindCityRequest() {
 var xhr = new XMLHttpRequest;
 xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
  latitude + "," + longitude + "&key=" + KEY_GOOGLE_MAPS);
 xhr.onreadystatechange = function () {
  if (xhr.readyState === xhr.DONE && xhr.status === 200) {
   parseInfoAboutCity(JSON.parse(xhr.responseText));
  }
 };
 xhr.send();
}

//  Determining name of location
function parseInfoAboutCity(locationInfo) {
 var $foundCity = document.getElementById('found-city');
 function isCityThere(n) {
  return n.types.indexOf('political') !== -1;
 }
 var cityObj = (locationInfo.results[0].address_components).find(isCityThere);

 if (cityObj){
  var foundCity = cityObj.long_name;
 }
 else {
  foundCity = "Unfortunately, could not determine";
 }
 $foundCity.innerText = 'Location : ' + foundCity;
}

// getting city from Request
function forecastRequest(url_forecast) {
 if (url_forecast) {
  $.ajax({
   url: url_forecast,
   dataType: 'jsonp'
  })
   .done(function(dataResponse) {
    console.log('dataResponse', dataResponse );
    $( "#loading" ).hide();
    getTimeZone(dataResponse);
    getWeather(dataResponse);
    getHumidity(dataResponse);
    getPressure(dataResponse);
    getTemperature(dataResponse);
    getWindSpeed(dataResponse);
    setBackgroundForPrecipitation(dataResponse);
    setImageForWeather(dataResponse);
   })
 }
}
// change background depending of precipitation
function setBackgroundForPrecipitation(dataResponse){
 var precifInfo = dataResponse.currently.precipType;
 if( precifInfo=='snow') {
  document.body.style.backgroundImage = 'url(./images/snow.gif)';
 }
 else if (precifInfo == 'rain'){
  document.body.style.backgroundImage = 'url(./images/rain.gif)';
 }
 else {
  document.body.style.backgroundImage = 'url(./images/background.jpeg)';
 }
}

// change weather-image depending of weather
function setImageForWeather(dataResponse) {
 var weatherInfo = dataResponse.currently.summary;
 var weatherImage = document.getElementById('weather-img');
 if (weatherInfo == 'Overcast') {
  weatherImage.src = 'images/cloudy.png';
 }
 else if (weatherInfo == 'Clear') {
  weatherImage.src = 'images/clear.svg';
 }
 else if (weatherInfo == 'Partly Cloudy') {
  weatherImage.src = 'images/partly-cloudy.png';
 }
 else if (weatherInfo == 'Foggy') {
  weatherImage.src = 'images/foggy.png';
 }
 else if (weatherInfo == 'Mostly Cloudy') {
  weatherImage.src = 'images/mostly-cloudy.png';
 }
 else if (weatherInfo == 'Drizzle') {
  weatherImage.src = 'images/drizzly.png';
 }
}
// getting time zone
function getTimeZone(dataResponse) {
 var $capital = document.getElementById('capital');
 var timeZone = dataResponse.timezone;
 var currentlyTime = dataResponse.currently.time;
  var date = (new Date(currentlyTime * 1000));
  var $date = document.getElementById('date');
 if(timeZone !=='Europe/Kiev' ) {
  clearInterval(timer);
  $date.innerHTML = date.toDateString();
 }
 $capital.innerText = 'Part of the world /Capital - ' + timeZone;
}

// getting weather
function getWeather(dataResponse) {
 var $weather = document.getElementById('weather');
 $weather.innerHTML = dataResponse.currently.summary + ', ' + dataResponse.hourly.summary;
}

// getting humidity
function getHumidity(dataResponse) {
 // getting absolute humidity
 var $humidity = document.getElementById('humidity');
 // absolute => relative humidity :
 $humidity.innerHTML = 'RH : ' + (dataResponse.currently.humidity *100).toFixed(1) + '%';
}

// getting humidity
function getPressure(dataResponse) {
 var $pressure = document.getElementById('pressure');
 // humidity => to mmHg    1 hPa = 0.75006375541921 mmHg
 $pressure.innerHTML = 'P : ' + (dataResponse.currently.pressure * 0.75).toFixed(1) + ' mmHg';
}

// getting temperature
function getTemperature(dataResponse) {
 // getting temperature in fahrenheit to celsius
 var $temperatureFahrenheit = Number(dataResponse.currently.temperature);

 // in fahrenheit => celsius [°C] = ([°F] - 32) × 5/9
 var temperatureCelsium = (($temperatureFahrenheit -32) * 5 / 9).toFixed(1);
 var $temperatureCelsium = document.getElementById('temperature');
 $temperatureCelsium.innerHTML = 'T : ' + temperatureCelsium + ' °C';
}

// getting wind speed
function getWindSpeed(dataResponse) {
 var $windSpeed = document.getElementById('wind-speed');
 $windSpeed.innerHTML = 'Wind Speed : ' + dataResponse.currently.windSpeed + ' m/sec';
}

function getWeatherForToday(){
 var $yesterday = document.getElementById('today');
 $yesterday.addEventListener('click',function () {
  // set clock
  setClockForToday();
  timer = setInterval(setClockForToday, 1000);
  defineTodayDate();
  checkEnterValueInInput();
 })
}
getWeatherForToday();

function getWeatherForYesterday(){
 var $yesterday = document.getElementById('yesterday');
 $yesterday.addEventListener('click',function () {
  //clear clock
  clearInterval(timer);
  // set display date for yesterday
  setTimeForYesterday();
  defineYesterdayDate();
  checkEnterValueInInput();
 })
}
getWeatherForYesterday();

function getWeatherForTomorrow(){
 var $tomorrow = document.getElementById('tomorrow');
 $tomorrow.addEventListener('click',function () {
  // clear clock
  clearInterval(timer);
  // set display date for tomorrow
  setTimeForTomorrow();
  defineTomorrowDate();
  checkEnterValueInInput();
 })
}
getWeatherForTomorrow();
// day in seconds
function defineNewDate() {
 newDateInSeconds = Math.round((new Date().getTime())/1000);
}

function defineYesterdayDate() {
 defineNewDate();
 Date_ = newDateInSeconds - DAY_IN_SECONDS;
}

function defineTomorrowDate() {
 defineNewDate();
 Date_ = newDateInSeconds + DAY_IN_SECONDS;
}

function defineTodayDate(){
 defineNewDate();
 Date_ = newDateInSeconds;
}

// checking whether entered city in input
function checkEnterValueInInput() {
 var inputCityValue = document.getElementById('find-input-city').value;
 if (!inputCityValue || inputCityValue === '') {
  geoLocation();
 }
 else {
  execute();
 }
}


