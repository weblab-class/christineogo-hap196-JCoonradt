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
  // list of users who endorsed this branch
  endorsements: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    name: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  animalGifURL: String,
});

module.exports = mongoose.model("branch", BranchSchema);