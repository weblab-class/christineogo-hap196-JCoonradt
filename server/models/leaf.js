const mongoose = require("mongoose");

const LeafSchema = new mongoose.Schema({
  name: String,
  description: String,
  animalGifURL: String,
  // to link project/certification
  link: String,
});

module.exports = mongoose.model("leaf", LeafSchema);    