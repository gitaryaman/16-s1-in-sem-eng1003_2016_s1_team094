/* GLOBAL VARIABLES */

var locationWeatherCache = new LocationWeatherCache();


/* CONSTANTS */

var API_KEY = "fe4c2e484723f0c51b0f6783375f171f";
var STORAGE_KEY = "weatherApp"; // Prefix to use for Local Storage


/* CODE TO INITIALISE FROM LOCAL STORAGE */

if (typeof Storage !== undefined)
{
    loadLocations();
}
else
{
    console.log("Local storage is not supported by this browser."); 
}


/* FUNCTIONS THAT FORMAT DATE */

// Returns a date in the format "YYYY-MM-DD".
Date.prototype.simpleDateString = function()
{
    function pad(value)
    {
        return ("0" + value).slice(-2);
    }

    var dateString = this.getFullYear() + "-" + 
            pad(this.getMonth() + 1, 2) + '-' + 
            pad(this.getDate(), 2);
    
    return dateString;
}

/* Returns the date format required by forecast.io API.
 * We always represent a date with a time of midday,
 * so our choice of day isn't susceptible to time zone errors.
 */
Date.prototype.forecastDateString = function()
{
    return this.simpleDateString() + "T12:00:00";
}


/* CODE FOR LOCATION WEATHER CACHE CLASS */

function LocationWeatherCache()
{
    // PRIVATE ATTRIBUTES:

    var locations = [];
    var callbacks = {};
    

    // PUBLIC METHODS:
    
    // Returns the number of locations stored in the cache.
    this.length = function() {
        return locations.length;
    };
    
    /* Returns the location object for a given index.
     * Indexes begin at zero.
     */
    this.locationAtIndex = function(index) {
        return locations[index];
    };

    /* Given a latitude, longitude and nickname, this method saves a 
     * new location into the cache. It will have an empty 'forecasts'
     * property. Returns the index of the added location.
     */
    this.addLocation = function(latitude, longitude, nickname)
    {
        var newLocation = {
            latitude: latitude,
            longitude: longitude,
            nickname: nickname,
            forecasts: {}
            /* The forecasts object will later contain key-value pairs referred
             * to as forecastKey and forecastData respectively; see below.
             * {
             *     "lat1,long1,time1": {...},
             *     "lat2,long2,time2": {...}
             * }
             */
        };
        
        var newLocationIndex = locations.push(newLocation) - 1;
        saveLocations();
        return newLocationIndex;
    }

    // Removes the saved location at the given index
    this.removeLocationAtIndex = function(index)
    {
        locations.splice(index, 1);
    }

    /* This method is used by JSON.stringify() to serialise this class.
     * Note that the callbacks attribute is only meaningful while there 
     * are active web service requests and so doesn't need to be saved.
     */
    this.toJSON = function() {
        var locationWeatherCachePDO = {
            locations: locations
        };
        
        return locationWeatherCachePDO;
    };

    /* Given a public-data-only version of the class (such as from
     * local storage), this method will initialise the current
     * instance to match that version.
     */
    this.initialiseFromPDO = function(locationWeatherCachePDO) {
        locations = locationWeatherCachePDO.locations;
    };

    /* Request weather for the location at the given index for the
     * specified date. 'date' should be JavaScript Date instance.
     * This method doesn't return anything, but rather calls the 
     * callback function when the weather object is available. This
     * might be immediately or after some indeterminate amount of time.
     * The callback function should have two parameters. The first
     * will be the index of the location and the second will be the 
     * weather object for that location.
     */ 
    this.getWeatherAtIndexForDate = function(index, date, callback)
    {
        var currentLocation = this.locationAtIndex(index);
        var forecastKey = this.constructForecastKey(currentLocation, date);
        
        if (currentLocation.forecasts.hasOwnProperty(forecastKey))
            {
                // The forecast for this location & time is already available
                
                var forecastData = currentLocation.forecasts[forecastKey];
                callback(index, forecastData);
            }
        else
            {
                callbacks[forecastKey] = callback;
                
                var URL = "https://api.forecast.io/forecast/" + API_KEY + "/" +
                    currentLocation.latitude + "," +
                    currentLocation.longitude + "," +
                    date.forecastDateString() + "?" +
                    "units=ca&exclude=currently,minutely,hourly,alerts,flags" +
                    "&callback=locationWeatherCache.weatherResponse";
                
                var script = document.createElement('script');
	            script.src = URL;
	            document.body.appendChild(script);
            }
    };
    
    /* Returns an appropriately formatted string to be used as a property name
     * in a forecasts object; it is formatted as "lat,long,time".
     */
    this.constructForecastKey = function(location, date)
    {
        var forecastKey = location.latitude + "," +
                          location.longitude + "," +
                          date.forecastDateString();
                          // QUESTION: Why don't we include the word 'prototype'?
        
        return forecastKey;
    }
    
    /* This is a callback function passed to forecast.io API calls. It will
     * be called via JSONP when the API call is loaded. This should invoke the
     * recorded callback function for that weather request.
     */
    this.weatherResponse = function(response)
    {
        var forecastData = response;
        
        var currentDate = new Date();
        var currentLocationIndex = indexForLocation(forecastData.latitude,forecastData.longitude);
        var currentLocation = this.locationAtIndex(currentLocationIndex);
        
        // Stores this data in the cache for future use and updates cache
        var forecastKey = this.constructForecastKey(currentLocation, currentDate);
        
        currentLocation.forecasts[forecastKey] = forecastData;
        saveLocations();
        
        // Calls the appropriate callback function
        var callback = callbacks[forecastKey];
        callback(currentLocationIndex, forecastKey, forecastData);
    };

    // PRIVATE METHODS:
    
    /* Given a latitude and longitude, this method looks through all
     * the stored locations and returns the index of the location with
     * matching latitude and longitude if one exists, otherwise it
     * returns -1.
     */
    function indexForLocation(latitude, longitude)
    {
        var desiredLocationIndex = -1; // Default value, assumes no match found
        
        for (var index = 0; index < locations.length; index++)
            {
                if (locations[index].latitude == latitude &&
                   locations[index].longitude == longitude)
                    {
                        /* A '==' has been used instead of '===' because the
                         * latitude and longitude value are stored as
                         * NUMBERS in the forecastData object, but STRINGS
                         * in the local location object.
                         */
                        desiredLocationIndex = index;
                    }
            }
        
        return desiredLocationIndex;
    }
    
    // END OF CLASS DEFINITION
}


/* LOADING FROM AND SAVING TO LOCAL STORAGE */

// Restore the singleton locationWeatherCache from Local Storage
function loadLocations()
{
    var lwcJSON = localStorage.getItem(STORAGE_KEY);
    
    // Check if app data is present in local storage
    if (lwcJSON)
    {
        var lwcPDO = JSON.parse(lwcJSON);
        locationWeatherCache.initialiseFromPDO(lwcPDO);
    }
}

// Save the singleton locationWeatherCache to Local Storage.
function saveLocations()
{
    var lwcJSON = JSON.stringify(locationWeatherCache);
    localStorage.setItem(STORAGE_KEY, lwcJSON);
}


