var userLocation;
var advice;

// initially show a piece of advice on page load
  displayRandomAdvice();
// on "show me another thing" button click
$("#buttonNo").click(function() {
  displayRandomAdvice();
});

// $(".gradient-content").hide();
  // $("#buttonYes").click(function() {
  //   $(".gradient-content").show();
  //   $("buttonYes").click(function() {
  //     $(".gradient-content").hide();
  //   })
  // })

// ========== GEOLOCATION ========== //

// function for finding the user's location using browser's geolocation
function geoFindMe() {
  // if the user's browser doesn't allow geolocation, console log and alertify the user.
  if (!navigator.geolocation){
    console.log("Sorry, your browser does not support geolocation.");
    alertify.success("Sorry, your browser does not support geolocation.");
  }

  // run this function if the user's browser does support geolocation
  function success(position) {
    // set the latitude and longitude from the returned response
    userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    // let the console log and user know we've got their location
    console.log("Thanks! Got your location.")
    alertify.success("Thanks! Got your location.");
    console.log("Lat is " + userLocation.lat + ", lng is " + userLocation.lng);
  }

  // if we can't get the user's location, let them know.
  function error() {
    console.log("Please allow us to locate you!");
    alertify.success("Please allow us to locate you!");
  }

  // this is actually getting the current location
  navigator.geolocation.getCurrentPosition(success, error);
}

// run the find location function on page load
geoFindMe();

// ========== FUNCTIONS ========== //

function displayRandomAdvice() {
    $.getJSON("/random", function(data) {
      // for each entry of that json...
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].thing);
        // display that advice in its div
        $(".advice").html("<h1>" + data[i].thing + "</h1>");
        // display advice number in its div
        $(".adviceNumber").html("<h3><i>advice # " + data[i].thingNumber + "  _____</i></h3>");
        advice = data[i].thingNumber;
        console.log("Advice number: " + advice);
      }
    });
};

$("#buttonYes").click(function() {
  console.log("Hi. " + advice);
});













