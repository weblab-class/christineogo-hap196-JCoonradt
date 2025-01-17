const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
  name: String,
  // a list of branches
  branches: [BranchSchema],
});

module.exports = mongoose.model("tree", TreeSchema);