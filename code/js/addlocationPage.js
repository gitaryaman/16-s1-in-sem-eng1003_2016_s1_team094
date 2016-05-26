// Code for the Add Location page.

window.addEventListener("load", pageFullyLoaded, false);

var map;
var geocoder;
var mapRef;
var changeCenterTimeout;

function pageFullyLoaded(e)
{   
    mapRef = document.getElementById('map');
    initMap();
}

function initMap()
{
    var monashClaytonPosition = {lat: -37.912, lng: 145.131};
    
    var mapOptions = {
        center: monashClaytonPosition,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(mapRef, mapOptions);
    geocoder = new google.maps.Geocoder;
}


function textFieldChanged() {
    var textInput = document.getElementById('address').value;
    console.log(textInput);
    var geocoderRequest = {
        "address": textInput
    };
    
    if (changeCenterTimeout === undefined)
        {
            changeCenterTimeout = setTimeout(function(){
                geocoder.geocode(geocoderRequest, changeMapCenter);
            }, 200);
        }
    else {
        clearTimeout(changeCenterTimeout);
        changeCenterTimeout = setTimeout(function(){
                geocoder.geocode(geocoderRequest, changeMapCenter);
            }, 200);
    }
}

function changeMapCenter(geocoderResult, geocoderStatus)
{
    if (geocoderResult.length > 0)
        {
            var latitude = geocoderResult[0].geometry.location.lat();
            var longitude = geocoderResult[0].geometry.location.lng();

            var coordinates = {
                lat: latitude,
                lng: longitude
            };
            
            map.setCenter(coordinates);
        }
}

function storeLocation()
{
    var nickname = document.getElementById("nickname").value;
    var coordinates = map.getCenter();
    
    var latitude = String(coordinates.lat());
    var longitude = String(coordinates.lng());
    
    console.log(latitude);
    console.log(longitude);
    
    locationWeatherCache.addLocation(latitude, longitude, nickname);
    
    window.location.href = "index.html";
} 

 /*function geocodeAddress(geocoder, resultsMap) {
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
*/


