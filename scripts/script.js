// key for DarkSky  key = 3efa51bb192ff7611151415d5a332aa9;
//  url = 'https://api.darksky.net/forecast/[key/[latitude],[longitude],[date]',

var KEY_DARK_SKY = '3efa51bb192ff7611151415d5a332aa9',
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
        var findTodayDay= moment().format('dddd') +'\n' + moment().format('MMMM Do YYYY, h:mm:ss a')  ;
        var $date = document.getElementById('date').innerText = findTodayDay;
    }

    //  yesterday date
    function setClockForYesterday()  {
        var findYesterdayDay= moment().subtract(1,'days').calendar() + '\n'+ moment().subtract(1,'days').format('MMMM Do YYYY');
        var $date = document.getElementById('date').innerText = findYesterdayDay;
    }

    //  tomorrow date
    function setClockForTomorrow()  {
        var findTomorrowDay= moment().add(1,'days').calendar() + '\n'+ moment().add(1,'days').format('MMMM Do YYYY');
        var $date = document.getElementById('date').innerText = findTomorrowDay;
    }


window.onload = function() {
        setClockForToday();
       timer = setInterval(setClockForToday, 1000);
    };

   // getting geolocation
    function geoLocation() {
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
        };
        function error() {
            notSupport.innerHTML = "Unable to retrieve your location and why " +
                "we can`t set your weather";
        };
        navigator.geolocation.getCurrentPosition(seccess, error);
    }
  geoLocation();


// getting city with Request
function FindCityRequest() {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        latitude + "," + longitude + "&key=" + KEY_GOOGLE_MAPS);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            parseInfoAboutCity(JSON.parse(xhr.responseText));
            // console.log('response', xhr.responseText);
        }
    };
    xhr.send();
}

//  Determining city
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
                getTimeZone(dataResponse);
                getWeather(dataResponse);
                getHumidity(dataResponse);
                getPressure(dataResponse);
                getTemperature(dataResponse);
                getPrecipitation(dataResponse);
                getWindSpeed(dataResponse);

            })
    }
}

// getting time zone
function getTimeZone(dataResponse) {
    var  timeZone = dataResponse.timezone;
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
    $humidity.innerHTML = 'RH : ' + dataResponse.currently.humidity *100 + '%';
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

// getting precipitation
function getPrecipitation(dataResponse) {
    var $precipitation = document.getElementById('precipitation');
    $precipitation.innerHTML = 'Precipitation : ' + dataResponse.currently.precipType;
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
            geoLocation();
        })
    }
     getWeatherForToday();

    function getWeatherForYesterday(){
        var $yesterday = document.getElementById('yesterday');
        $yesterday.addEventListener('click',function () {
            //clear clock
            clearInterval(timer);
            // set display date for yesterday
            setClockForYesterday();
            defineYesterdayDate();
            geoLocation();
        })
    }
    getWeatherForYesterday();

    function getWeatherForTomorrow(){
    var $tomorrow = document.getElementById('tomorrow');
    $tomorrow.addEventListener('click',function () {
        // clear clock
        clearInterval(timer);
        // set display date for tomorrow
        setClockForTomorrow();
        defineTomorrowDate();
        geoLocation();
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

