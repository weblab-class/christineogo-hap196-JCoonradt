const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: String,
  // a list of twigs
  twigs: [TwigSchema],
  description: String,
  animalGifURL: String,
});

module.exports = mongoose.model("branch", BranchSchema);