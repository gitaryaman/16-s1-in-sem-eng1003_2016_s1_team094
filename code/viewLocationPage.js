// Code for the View Location page.

// This is sample code to demonstrate navigation.
// You need not use it for final app.

var locationIndex = localStorage.getItem(APP_PREFIX + "-selectedLocation");
if (locationIndex !== null) {
    var locationNames = ["Location A", "Location B"];
    // If a location name was specified, use it for header bar title.
    document.getElementById("headerBarTitle").textContent = locationNames[locationIndex];
}

var map;
var infoWindow;

function initMap() {
    // Display a map, centred on Monash Clayton (needs to be centered on desired location)
    var selectedLocation = {
        lat: -37.912
        , lng: 145.131
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16
        , center: selectedLocation
    });
    infowindow = new google.maps.InfoWindow;
}