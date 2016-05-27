// Code for the View Location page.

//Global Variables
var selectedLocation;
var locationIndex;
var map;
var mapRef;
var geocoder;
var infoWindow;
var dateToDisplay;

var lioJSON = localStorage.getItem("location-clicked");


window.addEventListener("load", pageFullyLoaded, false);
    
// Check if app data is present in local storage
if (lioJSON)
{
    var locationIndexObject = JSON.parse(lioJSON);
    locationIndex = locationIndexObject.index;
    selectedLocation = locationWeatherCache.locationAtIndex(locationIndex);
}

// Navigation

if (selectedLocation !== undefined) {
    document.getElementById("headerBarTitle").textContent = selectedLocation.nickname;
}

///////////////////////////////////////////////////////////MAP/////////////////////////////////////////////////////////////////////////////////

function pageFullyLoaded(e)
{   
    mapRef = document.getElementById('map');
    initMap();
}

function initMap()
{
    var latitude = Number(selectedLocation.latitude);
    var longitude = Number(selectedLocation.longitude);
    
    var position = {lat: latitude, lng: longitude};
    
    var mapOptions = {
        center: position,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(mapRef, mapOptions);
    
    infowindow = new google.maps.InfoWindow;

    // Display an overlay with a location pin and label.
    
    var marker = new google.maps.Marker({
        position: position,
        map: map
    });
    
    infowindow.setContent(selectedLocation.nickname);
    infowindow.open(map, marker);
    
    geocoder = new google.maps.Geocoder;
    
    initWeatherInfo(30);
}

function initWeatherInfo(sliderValue)
{
    dateToDisplay = sliderDate(sliderValue);
    locationWeatherCache.getWeatherAtIndexForDate(locationIndex, dateToDisplay, updateDOM);
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
}

//called by the forecast.io call. Generates a date readable by forecast.io
function forecastAPIDate(value) {
    var forecastDate = sliderDate(value);
    return forecastDate.forecastDateString();
}

///////////////////////////////////////////////////////WEATHER INFORMATION///////////////////////////////////////////////////////////////////////


//creates a DOM instance with all information added to the html file
function updateDOM(locationIndex, forecastData){
    
    var dailyData = forecastData.daily.data[0];
    // variables
    document.getElementById("currentConditions").innerHTML = dailyData.summary;
    document.getElementById("maxTemp").innerHTML = Math.round(dailyData.temperatureMax) + "&#8451";
    document.getElementById("minTemp").innerHTML = Math.round(dailyData.temperatureMin) + "&#8451";
    document.getElementById("humidity").innerHTML = Math.round(dailyData.humidity) + "%";
    document.getElementById("windSpeed").innerHTML = Math.round(dailyData.windSpeed) + "km/h";
}

///////////////////////////////////////////////////////REMOVE LOCATION BUTTON///////////////////////////////////////////////////////////////////?

function removeLocationButton(locationIndex){
    locationWeatherCache.removeLocationAtIndex(locationIndex);
    LocationWeatherCache.saveLocations();
}