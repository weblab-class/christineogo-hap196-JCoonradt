const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: String,
  // a list of leaves
  leaves: [{
    type: mongoose.Schema.Types.ObjectId,
    // reference to the appropriate leaf model
    ref: 'leaf'  
  }],
  description: String,
  animalGifURL: String,
});

module.exports = mongoose.model("branch", BranchSchema);