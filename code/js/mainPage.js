// Code for the main app page (locations list).

contentRef = document.getElementById("main");
initialise();

// This is sample code to demonstrate navigation.
// You need not use it for final app.

/*function viewLocation(locationName)
{
    // Save the desired location to local storage
    localStorage.setItem(APP_PREFIX + "-selectedLocation", locationName); 
    // And load the view location page.
    location.href = 'viewlocation.html';
}*/

// Adds a location summary node to the content div
function addLocationSummary(index, response)
{
    var dailyData = response.daily.data[0];
        
    var currentDate = new Date();
    var currentLocationIndex = index;
    
    var currentLocation = locationWeatherCache.locationAtIndex(currentLocationIndex);
    
    // Creating the <image> tag
    var iconRef = document.createElement("img");
    var iconSource = "images/" + dailyData.icon + ".png";
    console.log(iconSource);
    iconRef.setAttribute("class", "icon");
    iconRef.setAttribute("src", iconSource);
    
    // Creating the <div> tag with class="icon-holder"
    var iconHolderRef = document.createElement("div");
    iconHolderRef.setAttribute("class", "icon-holder");
    iconHolderRef.appendChild(iconRef);
    
    // Creating the <div> tag with class="temp-low"
    var tempLowRef = document.createElement("div");
    tempLowRef.setAttribute("class", "temp-low");
    tempLowRef.innerHTML = Math.round(dailyData.temperatureMin);
    
    // Creating the <div> tag with class="temp-high"
    var tempHighRef = document.createElement("div");
    tempHighRef.setAttribute("class", "temp-high");
    tempHighRef.innerHTML = Math.round(dailyData.temperatureMax);
    
    // Creating the <div> tag with class="top"
    var topRef = document.createElement("div");
    topRef.setAttribute("class", "top");
    topRef.appendChild(tempLowRef);
    topRef.appendChild(iconHolderRef);
    topRef.appendChild(tempHighRef);
    
    // Creating the <div> tag with class="bottom"
    var bottomRef = document.createElement("div");
    bottomRef.setAttribute("class", "bottom");
    bottomRef.innerHTML = currentLocation.nickname;
    
    // Creating the <div> tag with class="location-summary"
    var locationSummaryRef = document.createElement("div");
    locationSummaryRef.setAttribute("class", "location-summary");
    locationSummaryRef.appendChild(topRef);
    locationSummaryRef.appendChild(bottomRef);

    // Creating the <a> tag
    var locationLinkRef = document.createElement("a");
    locationLinkRef.setAttribute("class", "location-link");
    locationLinkRef.setAttribute("href", "viewlocation.html");
    locationLinkRef.appendChild(locationSummaryRef);
    
    // Linking everything back to the main content
    contentRef.appendChild(locationLinkRef);
}

// Initialises page
function initialise()
{
    var numLocations = locationWeatherCache.length();
    console.log(numLocations);
    var currentDate = new Date();
    
    for (var locationIndex = 0; locationIndex < numLocations; locationIndex++)
        {
            var currentLocation = locationWeatherCache.locationAtIndex(locationIndex);
            var locationName = currentLocation.nickname;
            
            locationWeatherCache.getWeatherAtIndexForDate(locationIndex, currentDate, addLocationSummary);
        }
}