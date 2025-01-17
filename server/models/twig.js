const mongoose = require("mongoose");

const TwigSchema = new mongoose.Schema({
  name: String,
  description: String,
  // a list of leaves
  leaves: [LeafSchema],
  animalGifURL: String,
});

module.exports = mongoose.model("twig", TwigSchema);