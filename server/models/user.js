const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  tree: {
    type: mongoose.Schema.Types.ObjectId,
    // reference to the appropriate tree model
    ref: 'tree'
  },
  friends: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending'
    }
  }]
});

// function to check if users are friends
UserSchema.methods.isFriendWith = function(userId) {
  return this.friends.some(friend => 
    friend.userId.equals(userId) && friend.status === 'accepted'
  );
};

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
