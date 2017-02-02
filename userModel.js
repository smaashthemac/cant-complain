// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Create a Schema for capturing clicks. We'll use clickID to update the same clickCounter
var userSchema = new Schema({
 thing: {
   type: String,
   validate: [
      function(input) {
        return input.length <= 60;
      },
      "Your advice must be 60 characters or less."
    ]
 },
 searchTerm: {
   type: String,
   validate: [
      function(input) {
        return input.length <= 60;
      },
      "Your search terms must be 60 characters or less."
    ]
 }

});

// Create the Model
var User = mongoose.model("User", userSchema);


// Export it for use elsewhere
module.exports = User;