// Code for the main app page (locations list).

contentRef = document.getElementById("main");
// Allows time for previous data to be stored in LocalStorage
initialise();

function whatWasClicked(event)
{
    var className = event.srcElement.className;
    locationClicked(classNameToLocationIndex(className));
}

// Parses the class name to return a location index
function classNameToLocationIndex(classNameString)
{
    var arrayOfWords = classNameString.split(" ");
    var locationIndex = arrayOfWords[1];
    return Number(locationIndex);
}

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
    iconRef.setAttribute("class", "icon" + " " + String(index));
    iconRef.setAttribute("src", iconSource);
    
    // Creating the <div> tag with class="icon-holder"
    var iconHolderRef = document.createElement("div");
    iconHolderRef.setAttribute("class", "icon-holder" + " " + String(index));
    iconHolderRef.appendChild(iconRef);
    
    // Creating the <div> tag with class="temp-low"
    var tempLowRef = document.createElement("div");
    tempLowRef.setAttribute("class", "temp-low" + " " + String(index));
    tempLowRef.innerHTML = Math.round(dailyData.temperatureMin);
    
    // Creating the <div> tag with class="temp-high"
    var tempHighRef = document.createElement("div");
    tempHighRef.setAttribute("class", "temp-high" + " " + String(index));
    tempHighRef.innerHTML = Math.round(dailyData.temperatureMax);
    
    // Creating the <div> tag with class="top"
    var topRef = document.createElement("div");
    topRef.setAttribute("class", "top" + " " + String(index));
    topRef.appendChild(tempLowRef);
    topRef.appendChild(iconHolderRef);
    topRef.appendChild(tempHighRef);
    
    // Creating the <div> tag with class="bottom"
    var bottomRef = document.createElement("div" );
    bottomRef.setAttribute("class", "bottom" + " " + String(index));
    bottomRef.innerHTML = currentLocation.nickname;
    
    // Creating the <div> tag with class="location-summary"
    var locationSummaryRef = document.createElement("div");
    locationSummaryRef.setAttribute("class", "location-summary" + " " + String(index));
    locationSummaryRef.appendChild(topRef);
    locationSummaryRef.appendChild(bottomRef);

    // Creating the <a> tag
    var locationLinkRef = document.createElement("div");
    locationLinkRef.setAttribute("class", "location-link" + " " + String(index));
    console.log(this);
    locationLinkRef.appendChild(locationSummaryRef);
    locationLinkRef.addEventListener("click", whatWasClicked, false);
    
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

// Save the last location clicked to Local Storage.
function locationClicked(locationIndex) {
    console.log("clicked");
    if (typeof locationIndex === "number")
        {
            var locationIndexObject = {index: locationIndex};

            // lio = locationIndexObject
            var lioJSON = JSON.stringify(locationIndexObject);
            localStorage.setItem("location-clicked", lioJSON);
            
            window.location.href = "viewlocation.html";
        }
}

function saveLocationClicked(locationIndex)
{
    var lioJSON = localStorage.getItem("location-clicked");
    
    // Check if app data is present in local storage
    if (lioJSON)
    {
        var lioPDO = JSON.parse(lioJSON);
        locationWeatherCache.initialiseFromPDO(lioPDO);
    }
}
