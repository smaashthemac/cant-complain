// ========== GLOBAL STUFF ========== //

// variables
var userLat;
var userLong;
var userLocation;
var advice;
var adviceNumber;
var adviceLink;
var adviceSearchTerm;
var weather;
var currentWeather;
var humidity;

// api keys
var weatherKey = "171d339521b42a7b";
var campgroundKey = "4xhxzg85vtzw2rqze6dv684j";
var trailKey = "iApNnB6tFfmshslaidIgWbkRfgfZp1pocQ1jsnwF9jWfxtFIjC";
var googleGeocodeKey = "AIzaSyBW-dCwfLOYD4tepelNbTvSHv9lJYoMc1I";
var googleKey = "AIzaSyArRr8-sS7MqEyrSQIko_YvACo-kFOZjUg";

// ========== ON PAGE LOAD ========== //
// initially show a piece of advice on page load
displayRandomAdvice();
// on "show me another thing" button click
$("#buttonNo").click(function() {
  displayRandomAdvice();

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
  $.ajax({
    url: "/random",
    method: "GET"
  }).done(function(data) {
    advice = data.thing;
    console.log(advice);
    // display that advice in its div
    $(".advice").html("<h1>" + advice + "</h1>");
    adviceNumber = data.thingNumber;
    // display advice number in its div
    $(".numberAdvice").html("<h3><i>advice # " + data.thingNumber + "  _____</i></h3>");
    if (data.link) {
            adviceLink = data.link;
            //console.log(adviceLink);
          } else if (data.searchTerm) {
            adviceSearchTerm = data.searchTerm;
            console.log(adviceSearchTerm);
          } 
    randomGradient(); 
    doAdvice();
    $(".gradient-content").empty();
    });
};

// function for turning user's lat/long (from browser's geocode) to an address using google's geolocation api.
// sets userLocation variable to something more searchable
function latLongConversion(lat, long) {
  $.ajax({url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLat + "," + userLong + "&key=" + googleGeocodeKey, method: "GET"}).done(function(response) {
      // drills down and returns the user's city
      userLocation = response.results[4].address_components[1].short_name;
  });
};

// this function uses the user's lat/long plus the current advice's search terms from the database, plugs them into the google places api, and returns top locations nearby
function placeSearch() {
  $.ajax({url: "https://maps.googleapis.com/maps/api/place/textsearch/json?location=" + userLat + "," + userLong + "&radius=500&query=" + adviceSearchTerm +"&key=" + googleKey, method: "GET"}).done(function(response) {
      // drills down
      console.log(response);
  });
};

// this is the app to get the user's current city weather data via the open weather map app. this is for some pieces of advice that require going outside.
function getWeather() {
  $.ajax({url: "https://api.wunderground.com/api/" + weatherKey + "/geolookup/q/" + userLat + "," + userLong + ".json", method: "GET"}).done(function(response) {
    $.ajax({url: "https://api.wunderground.com/api/" + weatherKey + "/conditions/q/" + response.location.state + "/" + response.location.city + ".json", method: "GET"}).done(function(response) {
      weather = response.current_observation.weather;
      currentWeather = response.current_observation.temperature_string;
      humidity = response.current_observation.relative_humidity;
      console.log(weather + " | Current Temp: " + currentWeather + " | " + humidity + " Humidity");
      $(".gradient-content").html("<h2 class='content'><i class='fa fa-sun-o fa-1x'></i> Local Weather</h2><h3 class='content'>" + weather + " | Current Temp: " + currentWeather + " | " + humidity + " Humidity</h3>");
    });
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

// function for randomly changing gradient when advice changes
function randomGradient() {
      var gradient = new Array ();
      gradient[1] = "../img/gradients/gradient1.jpg";
      gradient[2] = "../img/gradients/gradient2.jpg";
      gradient[3] = "../img/gradients/gradient3.jpg";
      gradient[4] = "../img/gradients/gradient4.jpg";
      gradient[5] = "../img/gradients/gradient5.jpg";
      gradient[6] = "../img/gradients/gradient6.jpg";
      gradient[7] = "../img/gradients/gradient7.jpg";
      gradient[8] = "../img/gradients/gradient8.jpg";
      gradient[9] = "../img/gradients/gradient9.jpg";
      gradient[10] = "../img/gradients/gradient10.jpg";
      gradient[11] = "../img/gradients/gradient11.jpg";
      gradient[12] = "../img/gradients/gradient12.jpg";
      gradient[13] = "../img/gradients/gradient13.jpg";
      gradient[14] = "../img/gradients/gradient14.jpg";
      gradient[15] = "../img/gradients/gradient15.jpg";
      gradient[16] = "../img/gradients/gradient16.jpg";
      var rnd = Math.floor( Math.random() * gradient.length );
      $("#gradient").fadeIn("fast", function() {
        $(this).css("background-image", "url(" + gradient[rnd] + ")"), "fast", function() {
          $(this).fadeOut("fast");
        };
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
    case 11:
    case 14:
    case 22:
    case 23:
    case 24:
    case 25:
        placeSearch();
    case 6:
    case 9:
    case 12:
    case 13:
    case 16:
    case 20:
    case 26:
        placeSearch();
        getWeather();
        break;
    case 1:
        getTrails();
        getWeather();
    case 27:
    case 28:
        getCampsites();
        getWeather();
    }

  });
};

// When user clicks submit button
$("#submit").on("click", function(event) {
  event.preventDefault();

  // Make a newChirp object
  var newAdvice = {
    thing: $("#advice").val(),
    searchTerm: $("#searchTerm").val()
  };

  console.log(newAdvice);

  // Send an AJAX POST-request with jQuery
  $.post("/api/post", newAdvice)
    // On success, run the following code
    .done(function() {
    });

  // Empty each input box by replacing the value with an empty string
  $("#advice").val("");
  $("#searchTerm").val("");
});

