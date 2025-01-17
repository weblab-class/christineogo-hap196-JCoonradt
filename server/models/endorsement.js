const mongoose = require("mongoose");

const EndorsementSchema = new mongoose.Schema({
    // the user who is endorsing
    endorserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    // comments/why they endorsed
    description: {
      type: String,
      required: true
    },
    // timestamp of when the endorsement was made
    timestamp: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model("endorsement", EndorsementSchema);