// Code for the Add Location page.

var map;
var geocoder;

function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: {lat: -34.397, lng: 150.644}
        });
        var geocoder = new google.maps.Geocoder();

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });
      }


function storeLocation(){
    var label= document.getElementById("address").value;
    var address= document.getElementById('location-input').value;
    var coordinates = null;
    console.log(address);
    geocodeAddress(address, function(lat_long){
        coordinates = lat_long;
        console.log(label + " :" + lat_long);
        LocationWeatherCache.addLocation(coordinates[0], coordinates[1], label);
        
    });
} 

 function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
