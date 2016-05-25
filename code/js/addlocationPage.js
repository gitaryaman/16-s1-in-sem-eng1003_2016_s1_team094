// Code for the Add Location page.

var map;
var geocoder;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
    geocoder = new google.maps.Geocoder();
}

function storeLocation(){
    var label= document.getElementById("label-input").value;
    var address= document.getElementById('location-input').value;
    var coordinates = null;
    console.log(address);
    geocodeAddress(address, function(lat_long){
        coordinates = lat_long;
        console.log(label + " :" + lat_long);
        LocationWeatherCache.addLocation(coordinates[0], coordinates[1], label);
        
    });
} 

function geocodeAddress(address, callback) {
    geocoder.geocode( {'address': address}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK ) {
            var location = [];
            location[0] = results[0].geometry.location.lat();
            location[1] = results[0].geometry.location.lng();
            
            callback(location);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
