// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Create a Schema for capturing clicks. We'll use clickID to update the same clickCounter
var AdviceSchema = new Schema({
 thing: {
   type: String
 },
 thingNumber: {
   type: Number
 },
 searchTerm: {
   type: String
 },
 link: {
   type: String
 }

});

// Create the Model
var Advice = mongoose.model("Advice", AdviceSchema);


// Export it for use elsewhere
module.exports = Advice;