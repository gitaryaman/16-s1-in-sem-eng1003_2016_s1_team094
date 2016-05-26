// Code for the View Location page.


//Global Variables
loadLocations();
var selectedLocation = locationWeatherCache.locationAtIndex

// Navigation
var APP_PREFIX = "weatherApp"
var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
//var locationIndex = localStorage.getItem(STORAGE_KEY + "-selectedLocation");
if (locationIndex !== null) {
    //reference a list of nicknames for locations
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

//document.getElementById("outputArea").innerHTML = '<div id="map" style="height: 400px; width: 100%;">Loading map...</div>';
//document.getElementById("headerBarTitle").textContent = "tedt";
// Give maps API time to load, then initialise map.

setTimeout(initMap, 1000);

//setTimeout(youAreHere, 3000);


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
    
    infowindow.setContent(selectedLocation);
    infowindow.open(map, marker);
}

////////////////////////////////////////////////////////////DATES////////////////////////////////////////////////////////////////////////////////

//generates a date based on the position of the slider, called as part of the slider callback function and forecastAPI function
function sliderDate(value) {
    var date = new Date();
    var msecSince1970 = date.getTime();
    var numberOfDaysBefore = 30 - value;
    msecSince1970 -= numberOfDaysBefore * 86400000;
    var sliderDate = new Date(msecSince1970);
    return sliderDate;
}

//called as a callback function with slider. Generates a string date and displays in the "date" field in the DOM
function sliderCallback(value) {
    var selectedDate = sliderDate(value);
    var stringDate = selectedDate.simpleDateString();
    document.getElementById("date").innerHTML = "Date: " + stringDate;
    return stringDate;
}

//called by the forecast.io call. Generates a date readable by forecast.io
function forecastAPIDate(value) {
    var forecastDate = sliderDate(value);
    return forecastDate.forecastDateString();
}

///////////////////////////////////////////////////////WEATHER INFORMATION///////////////////////////////////////////////////////////////////////

function getWeather(value){
    locationWeatherCache.getWeatherAtIndexForDate(locationIndex, sliderDate(value), updateDOM);
}
var key = num.toString(selectedLocation.latitude) + "," + num.toString(selectedLocation.longitude) + "," + forecastAPIDate(value)
var locationWeather = selectedLocation.forecasts[key]


//creates a DOM instance with all information added to the html file
function updateDOM(locationIndex, locationWeather){
    // variables
    document.getElementById("currentConditions").innerHTML = "Current Conditions: " + locationWeather.daily.data.summary;
    document.getElementById("maxTemp").innerHTML = "Maximum Temperature: " + Math.round(locationWeather.daily.data.temperatureMax) + "&#8451";
    document.getElementById("minTemp").innerHTML = "Minimum Temperature: " + Math.round(locationWeather.daily.data.temperatureMin) + "&#8451";
    document.getElementById("humidity").innerHTML = "Humidity: " + Math.round(locationWeather.daily.data.humidity) + "%";
    document.getElementById("windSpeed").innerHTML = "Wind Speed: " + Math.round(locationWeather.daily.data.windSpeed) + "km/h";
}

///////////////////////////////////////////////////////REMOVE LOCATION BUTTON///////////////////////////////////////////////////////////////////?

function removeLocationButton(locationIndex){
    locationWeatherCache.removeLocationAtIndex(locationIndex);
    LocationWeatherCache.saveLocations();
}