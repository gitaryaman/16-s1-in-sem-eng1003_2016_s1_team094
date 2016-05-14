// Code for the Add Location page.

window.addEventListener("load", pageFullyLoaded, false);

var map;
var mapRef;

function pageFullyLoaded(e)
{
    
    if (!document.getElementById("mapsapi"))
    {
        // Only create the Google Maps API script tag if we haven't already 
        // added it to the page.
        var script = document.createElement("script");
        script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?v=3&libraries=places");
        script.setAttribute("id", "mapsapi");
        var bodyNode = document.getElementsByTagName("body")[0];
        bodyNode.appendChild(script);
    }
    
    mapRef = document.getElementById('map-div');
    mapRef.style.width="400px";
    mapRef.style.height="500px";
    setTimeout(initMap, 1000);
    
}

function initMap() {
    
    var monashClaytonPosition = {lat: -37.912, lng: 145.131};
    
    var mapOptions = {
        center: monashClaytonPosition,
        zoom: 6
    };
    
    map = new google.maps.Map(mapRef, mapOptions);
    
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        
        var places = searchBox.getPlaces();

        if (places.length == 0)
        {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport)
            {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            }
            else
            {
                bounds.extend(place.geometry.location);
            }
        });
        
        map.fitBounds(bounds);
        
    });
    
}  