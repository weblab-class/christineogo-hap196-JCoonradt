const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: String,
  description: String,
  // a list of twigs
  twigs: [{
    type: mongoose.Schema.Types.ObjectId,
    // reference to the twig model
    ref: 'twig'
  }],
  animalGifURL: String,
});

module.exports = mongoose.model("branch", BranchSchema);