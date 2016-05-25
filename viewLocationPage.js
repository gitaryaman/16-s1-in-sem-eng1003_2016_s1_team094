// Code for the View Location page.

var locationsInCache = loadLocations();
var APIDate = forecastAPIDate(value);
var locationIndex = locationWeatherCache.indexForLocation;
var selectedLocation = locationsInCache[locationIndex]

// Navigation
var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
if (locationIndex !== null) {
    var locationNames = ["Location A", "Location B"];
    // If a location name was specified, use it for header bar title.
    document.getElementById("headerBarTitle").textContent = locationNames[locationIndex];
}

///////////////////////////////////////////////////////////MAP/////////////////////////////////////////////////////////////////////////////////

if (!document.getElementById("mapsapi")) {
    // Only create the Google Maps API script tag if we haven't already 
    // added it to the page.
    var script = document.createElement("script");
    script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?v=3");
    script.setAttribute("id", "mapsapi");
    var bodyNode = document.getElementsByTagName("body")[0];
    bodyNode.appendChild(script);
}

var map;
var infoWindow;

document.getElementById("outputArea").innerHTML = '<div id="map" style="height: 600px; width: 100%;">Loading map...</div>';

// Give maps API time to load, then initialise map.

setTimeout(initMap, 1000);

setTimeout(youAreHere, 3000);


function initMap() {
    // Display a map, centred on Monash Clayton.
    
    var selectedLocationPosition = {
        lat: selectedLocation.latitude
        , lng: selectedLocation.longitude
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16
        , center: selectedLocationPosition
    });
    infowindow = new google.maps.InfoWindow;

    // Display an overlay with a location pin and label.
    
    var marker = new google.maps.Marker({
        position: selectedLocationPosition
        , map: map
    });
    
    infowindow.setContent(locationNames[locationIndex]);
    infowindow.open(map, marker);
}

////////////////////////////////////////////////////////////DATES////////////////////////////////////////////////////////////////////////////////


function sliderDate(value) {
    //generates a date based on the position of the slider, called as part of the slider callback function and forecastAPI function
    var date = new Date();
    var msecSince1970 = date.getTime();
    var numberOfDaysBefore = 30 - value;
    msecSince1970 -= numberOfDaysBefore * 86400000;
    var sliderDate = new Date(msecSince1970);
    return sliderDate;
}

function sliderCallback(value) {
    //called as a callback function with slider. Generates a string date and displays in the "date" field in the DOM
    var selectedDate = sliderDate(value);
    var stringDate = selectedDate.simpleDateString();
    document.getElementById("date").innerHTML = "Date: " + stringDate;
    return stringDate;
}

function forecastAPIDate(value) {
    //called by the forecast.io call. Generates a date readable by forecast.io
    var forecastDate = sliderDate(value);
    return forecastDate.forecastDateString();
}

///////////////////////////////////////////////////////WEATHER INFORMATION//////////////////////////////////////////////////////////////////////

var locationWeather = selectedLocation.forecasts
var locationWeather = locationWeatherCache.getWeatherAtIndexForDate(locationIndex, APIDate, updateDOM);

function weatherCallback(locationIndex, locationWeather) {
    weatherForDate = locationWeather.daily
    return locationWeather
}

function updateDOM(){
        //creates a DOM instance with all information filled in the html file
    document.getElementById("currentConditions").innerHTML = "Current Conditions: " + locationWeather.data.summary;
    document.getElementById("maxTemp").innerHTML = "Maximum Temperature: " + ((locationWeather.data.temperaturemax.toFixed(2) - 32)/1.8) + "&#8451";
    document.getElementById("minTemp").innerHTML = "Minimum Temperature: " + ((locationWeather.data.temperaturemin.toFixed(2) - 32)/1.8) + "&#8451";
    document.getElementById("humidity").innerHTML = "Humidity: " + locationWeather.data.humidity.toFixed(2) + "%";
    document.getElementById("windSpeed").innerHTML = "Wind Speed: " + locationWeather.windSpeed.toFixed(2) + "km/h";
}