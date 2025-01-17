const mongoose = require("mongoose");

const TwigSchema = new mongoose.Schema({
  name: String,
  description: String,
  // a list of leaves
  leaves: [{
    type: mongoose.Schema.Types.ObjectId,
    // reference to the appropriate leaf model
    ref: 'leaf'  
  }],
  animalGifURL: String,
});

module.exports = mongoose.model("twig", TwigSchema);