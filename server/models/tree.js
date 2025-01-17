const mongoose = require("mongoose");

const TreeSchema = new mongoose.Schema({
  name: String,
  // a list of branches
  branches: [{
    type: mongoose.Schema.Types.ObjectId,
    // reference to the appropriate branch model
    ref: 'branch'  
  }],
});

module.exports = mongoose.model("tree", TreeSchema);