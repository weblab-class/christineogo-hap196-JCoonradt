/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Branch = require("./models/branch");
const Twig = require("./models/twig");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | Tree API Methods!|
// |------------------------------|

// create a new branch
router.post("/branch", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const newBranch = {
      creator_id: req.user._id,
      name: req.body.name,
      description: req.body.description,
    };

    const branch = await Branch.create(newBranch);

    // Find user and update their tree by adding the new branch
    await User.findById(req.user._id).populate('tree').then(async (user) => {
      user.tree.branches.push(branch._id);
      await user.tree.save();
    });

    res.send(branch);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// get a user's tree
router.get("/tree/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'tree',
      populate: {
        path: 'branches',
        model: 'branch'
      }
    });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user.tree);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// get a single branch by id
router.get("/branch/:branchId", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.branchId);
    if (!branch) {
      return res.status(404).send({ error: "Branch not found" });
    }
    res.send(branch);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// update a branch
router.put("/branch/:branchId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const branch = await Branch.findById(req.params.branchId);

    if (!branch) {
      return res.status(404).send({ error: "Branch not found" });
    }

    // // check if the user is the creator of the branch
    // do later because we don't have a creator_id field yet **

    branch.name = req.body.name;
    branch.description = req.body.description;
    await branch.save();

    res.send(branch);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// delete a branch
router.delete("/branch/:branchId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const branch = await Branch.findById(req.params.branchId);

    if (!branch) {
      return res.status(404).send({ error: "Branch not found" });
    }

    // Remove branch from user's tree
    await User.findById(req.user._id).populate('tree').then(async (user) => {
      user.tree.branches = user.tree.branches.filter(b => b.toString() !== req.params.branchId);
      await user.tree.save();
    });

    // Delete the branch
    await Branch.findByIdAndDelete(req.params.branchId);

    res.send({ message: "Branch deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// create a new twig
router.post("/twig", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    // create a new twig
    const newTwig = {
      creator_id: req.user._id,
      name: req.body.name,
      description: req.body.description,
      branchId: req.body.branchId,
    };

    // create it in the database
    const twig = await Twig.create(newTwig);

    // find branch and update its twigs by adding the new twig
    await Branch.findById(req.body.branchId).then(async (branch) => {
      branch.twigs.push(twig._id);
      await branch.save();
    });

    res.send(twig);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

//forest
// Get all users with optional search filter (maybe change later if we don't want them to be able to see everyone)
router.get("/trees", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    console.log("API received search query:", searchQuery);
    
    let users;
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      console.log("Using regex:", searchRegex);
      
      users = await User.find({
        name: { $regex: searchRegex }
      }).select('name _id');
      
      console.log("MongoDB query:", {
        name: { $regex: searchRegex }
      });
      console.log("Found users:", users);
    } else {
      users = await User.find({}).select('name _id');
      console.log("Found all users:", users);
    }

    const trees = users.map(user => ({
      ownerId: user._id,
      ownerName: user.name,
    }));

    console.log("Sending trees response:", trees);
    res.send(trees);
  } catch (err) {
    console.log(`Failed to get trees: ${err}`);
    res.status(500).send({ error: "Failed to get trees" });
  }
});

// Send friend request
router.post("/friend-request", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { friendId } = req.body;
    const mongoose = require('mongoose');
    
    if (!req.user) {
      return res.status(401).send({ error: "You must be logged in to send friend requests" });
    }
    
    // Convert both IDs to ObjectId
    const friendObjectId = new mongoose.Types.ObjectId(friendId);
    const userObjectId = new mongoose.Types.ObjectId(req.user._id);

    // Don't allow self-friend requests
    if (userObjectId.toString() === friendObjectId.toString()) {
      return res.status(400).send({ error: "Cannot send friend request to yourself" });
    }

    // Check if the friend exists
    const friend = await User.findById(friendObjectId);
    if (!friend) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if already friends or request pending
    const user = await User.findById(userObjectId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    
    const existingFriend = user.friends.find(friend => 
      friend.userId.toString() === friendObjectId.toString()
    );

    if (existingFriend) {
      return res.status(400).send({
        error: `Already ${existingFriend.status === 'pending' ? 'sent a request' : 'friends'}`
      });
    }

    // Add friend request
    user.friends.push({ userId: friendObjectId, status: 'pending' });
    await user.save();

    res.send({ message: "Friend request sent" });
  } catch (err) {
    console.log(`Failed to send friend request: ${err}`);
    if (err.name === 'CastError') {
      return res.status(400).send({ error: "Invalid user ID format" });
    }
    res.status(500).send({ error: "Failed to send friend request" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
