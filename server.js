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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res, next) {
  // Handle the get for this route
});

app.post('/', function(req, res, next) {
 // Handle the post for this route
});

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

var newAdvice = require("./model.js")
app.post("/api/post", function(req, res) {
	console.log(req.body);
	newAdvice.create({
		thing: req.body.thing,
		searchTerm: req.body.searchTerm	
	}).then(function(results) {
		res.end();
	});

});

// set the app to listen on port 3000
app.listen(process.env.PORT || 3000, function() {
	console.log("App running on port 3000");
});