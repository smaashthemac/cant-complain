// ========== INITIAL SETUP ========== //

// dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// initialize express
var app = express();

// set up a static folder (public) for the app
app.use(express.static("public"));

// sets up the express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// // database configuration
// // save the url of the database as well as the name of the collection
// var databaseURL = process.env.MONGODB_URI || "feelgood";
// var collection = ["advice"];

// // use mongojg to hook the database up to the db variable
// var db = mongojs(databaseURL, collection);

// // log any errors if mongodb has an issue
// db.on("error", function(error) {
// 	console.log("Database error: ", error);
// });

// MongoDB configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/feelgood");
var db = mongoose.connection;

db.on("error", function(err) {
 console.log("Mongoose Error: ", err);
});

db.once("open", function() {
 console.log("Mongoose connection successful.");
});

// ========== ROUTES ========== //

var Advice = require("./model.js")

// get one random piece of advice from advice collection
app.get("/random", function(req, res) {
	var random = Math.floor(Math.random() * 28);
	Advice.findOne().skip(random)
	.exec(function(error, doc) {
		if (error) {
			res.send(error);
		}
		else {
			res.json(doc);
			console.log(doc);
		}
	});
});

// set the app to listen on port 3000
app.listen(process.env.PORT || 3000, function() {
	console.log("App running on port 3000");
});