// ========== INITIAL SETUP ========== //

// dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");

// initialize express
var app = express();

// set up a static folder (public) for the app
app.use(express.static("public"));

// sets up the express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// database configuration
// save the url of the database as well as the name of the collection
var databaseURL = process.env.MONGODB_URI || "feelgood";
var collection = ["advice"];

// use mongojg to hook the database up to the db variable
var db = mongojs(databaseURL, collection);

// log any errors if mongodb has an issue
db.on("error", function(error) {
	console.log("Database error: ", error);
});

// ========== ROUTES ========== //

// get one random piece of advice from advice collection
app.get("/random", function(req, res) {
	// query: return one random thing
	db.advice.aggregate( { $sample: { size: 1 } }, function(error, found) {
		// log any errors
		if (error) {
			console.log(error);
		}
		// otherwise, send the result of the query to the browser
		else {
			res.json(found);
		}
	});
});

// set the app to listen on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000");
});