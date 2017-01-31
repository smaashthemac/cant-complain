// ========== GLOBAL STUFF ========== //

// variables
var userLat;
var userLong;
var userLocation;
var advice;
var adviceNumber;
var adviceLink;
var adviceSearchTerm;

// api keys
var weatherKey = "df91bce1942a27843b3b36556dfc230e";
var campgroundKey = "4xhxzg85vtzw2rqze6dv684j";
var trailKey = "iApNnB6tFfmshslaidIgWbkRfgfZp1pocQ1jsnwF9jWfxtFIjC";
var googleGeocodeKey = "AIzaSyBW-dCwfLOYD4tepelNbTvSHv9lJYoMc1I";
var googleKey = "AIzaSyArRr8-sS7MqEyrSQIko_YvACo-kFOZjUg";

// ========== ON PAGE LOAD ========== //

// initially show a piece of advice on page load
  //displayRandomAdvice();
  display();
// on "show me another thing" button click
$("#buttonNo").click(function() {
  //displayRandomAdvice();
});

// initialize firebase
var config = {
    apiKey: "AIzaSyAkckB-EevMjzbTDZCt4Wh2M7_3wx13-UU",
    authDomain: "feelgoodadvice-fd190.firebaseapp.com",
    databaseURL: "https://feelgoodadvice-fd190.firebaseio.com",
    storageBucket: "feelgoodadvice-fd190.appspot.com",
    messagingSenderId: "368164623318"
  };
  firebase.initializeApp(config);


// ========== GEOLOCATION ========== //

// function for finding the user's location using browser's geolocation
function geoFindMe() {
  // if the user's browser doesn't allow geolocation, console log and alertify the user.
  if (!navigator.geolocation){
    //console.log("Sorry, your browser does not support geolocation.");
    alertify.success("Sorry, your browser does not support geolocation.");
  }

  // run this function if the user's browser does support geolocation
  function success(position) {
    // set the latitude and longitude from the returned response
    userLat = position.coords.latitude;
    userLong = position.coords.longitude;
    console.log(userLat, userLong);
    latLongConversion();

    // let the console log and user know we've got their location
    //console.log("Thanks! Got your location.")
    alertify.success("Thanks for sharing your location.");
    //console.log("lat " + userLat + " long " + userLong);
  }

  // if we can't get the user's location, let them know.
  function error() {
    //console.log("Please allow us to locate you!");
    alertify.success("Please allow us to locate you.");
  }

  // this is actually getting the current location
  navigator.geolocation.getCurrentPosition(success, error);
}

// run the find location function on page load
geoFindMe();

// ========== FUNCTIONS ========== //

// function for displaying advice randomly from the database
// sets advice variable, adviceNumber variable, adviceLink variable (if there is a link) and adviceSearchTerm variable (if there are search terms)
function displayRandomAdvice() {
    $.getJSON("/random", function(data) {
      // for each entry of that json...
      for (var i = 0; i < data.length; i++) {
        advice = data[i].thing;
        console.log(advice);
        // display that advice in its div
        $(".advice").html("<h1>" + data[i].thing + "</h1>");
        // display advice number in its div
        $(".numberAdvice").html("<h3><i>advice # " + data[i].thingNumber + "  _____</i></h3>");
        adviceNumber = data[i].thingNumber;
        //console.log(adviceNumber);
          if (data[i].link) {
            adviceLink = data[i].link;
            //console.log(adviceLink);
          } else if (data[i].searchTerm) {
            adviceSearchTerm = data[i].searchTerm;
            console.log(adviceSearchTerm);
          }
        // calls the function doAdvice  
        doAdvice();
      }
    });
};

function display() {
  console.log("hi");
  //var currentURL = window.location.origin;
  $.ajax({
    url: "/random",
    method: "GET"
  }).done(function(data) {
    console.log(data);
    console.log("got it");
  });
};

// function for turning user's lat/long (from browser's geocode) to an address using google's geolocation api.
// sets userLocation variable to something more searchable
function latLongConversion(lat, long) {
  $.ajax({url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLat + "," + userLong + "&key=" + googleGeocodeKey, method: "GET"}).done(function(response) {
      // drills down and returns the user's city
      userLocation = response.results[4].address_components[1].short_name;
      console.log(userLocation);
      getWeather();
  });
};

// this function uses the user's lat/long plus the current advice's search terms from the database, plugs them into the google places api, and returns top locations nearby
function placeSearch() {
  $.ajax({url: "https://maps.googleapis.com/maps/api/place/textsearch/json?location=" + userLat + "," + userLong + "&radius=500&query=" + adviceSearchTerm +"&key=" + googleKey, method: "GET", dataType: "JSONP"}).done(function(response) {
      // drills down
      console.log(response);
  });
};

// this is the app to get the user's current city weather data via the open weather map app. this is for some pieces of advice that require going outside.
function getWeather() {
  $.ajax({url: "https://api.openweathermap.org/data/2.5/weather?APPID=" + weatherKey + "&q=" + userLocation, method: "GET"}).done(function(response) {
      // drills down to get current temp (must be converted to farenheit), city, humidity, and wind
      var city = response.name;
      var temp = Math.round((9/5 * (response.main.temp - 273) + 32)) + "°F";
      var humidity = response.main.humidity + "°";
      var wind = response.wind.speed + "mph";
      console.log(temp + " | " + humidity + " | " + wind);
  });
};

// this function delivers campsites information based on the user's location.
// this isn't working for the same reason the google places call wasn't working...
// revisit this
function getCampsites() {
  $.ajax({url: "https://api.amp.active.com/camping/campgrounds?landmarkName=true&landmarkLat=" + userLat + "&landmarkLong=" + userLong + "&xml=true&api_key=" + campgroundKey, method: "GET"}).done(function(response) {
      // drills down and returns
      console.log(response);
  });
};

// this function delivers trail information based on the user's location.
function getTrails() {
  $.ajax({url: "https://trailapi-trailapi.p.mashape.com/?lat=" + userLat + "&limit=5&lon=" + userLong + "&q[activities_activity_type_name_eq]=hiking&radius=25&mashape-key=" + trailKey, method: "GET"}).done(function(response) {
      // drills down and returns the name of the park, directions, and description.
      for (var i = 0; i < response.places.length; i++) {
        console.log(response.places[i].name);
        console.log(response.places[i].directions);
        // some trails don't have descriptions; if they do, show it. if not, don't.
        if (response.places[i].description) {
          console.log(response.places[i].description);
        };
      }
  });
};


// this function, on click of the "i want to do that thing button" goes through a series of switch cases that represent every item in the database, because some take the user to an external page, some call upon the custom google search api, some use other apis.
function doAdvice() {
  $("#buttonYes").click(function() {

    switch(adviceNumber) {
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 15:
    case 17:
    case 18:
    case 19:
    case 21:
        window.open(adviceLink);
        break;
    case 2:
    case 4:
    case 6:
    case 9:
    case 11:
    case 12:
    case 13:
    case 14:
    case 16:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
        placeSearch();
        break;
    case 1:
        getTrails();
    case 27:
    case 28:
        getCampsites();
    case 20:
        // explore a new part of town
    }

  });
};

