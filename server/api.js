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
const Leaf = require("./models/leaf");

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
    await User.findById(req.user._id)
      .populate("tree")
      .then(async (user) => {
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
      path: "tree",
      populate: {
        path: "branches",
        model: "branch",
        populate: {
          path: "twigs",
          model: "twig",
          populate: {
            path: "leaves",
            model: "leaf",
          },
        },
      },
    });

    if (!user || !user.tree) {
      return res.status(404).send({ error: "User or tree not found" });
    }

    console.log("Sending tree data:", user.tree);
    res.send(user.tree);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// get a single branch by id
router.get("/branch/:branchId", async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.branchId).populate("twigs");
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
    const branch = await Branch.findById(req.params.branchId).populate("twigs");

    if (!branch) {
      return res.status(404).send({ error: "Branch not found" });
    }

    // Remove branch from user's tree
    await User.findById(req.user._id)
      .populate("tree")
      .then(async (user) => {
        user.tree.branches = user.tree.branches.filter((b) => b.toString() !== req.params.branchId);
        await user.tree.save();
      });

    // make sure to delete all leaves associated with each twig
    for (const twig of branch.twigs) {
      const twigDoc = await Twig.findById(twig._id).populate("leaves");
      if (twigDoc && twigDoc.leaves) {
        await Leaf.deleteMany({ _id: { $in: twigDoc.leaves } });
      }
      await Twig.findByIdAndDelete(twig._id);
    }

    // Delete the branch
    await Branch.findByIdAndDelete(req.params.branchId);

    res.send({ message: "Branch and all associated twigs and leaves deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// endorse a branch
router.post("/branch/:branchId/endorse", auth.ensureLoggedIn, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.branchId);
    if (!branch) {
      return res.status(404).send({ error: "Branch not found" });
    }

    // Check if user has already endorsed
    const existingEndorsement = branch.endorsements.find(
      (e) => e.userId.toString() === req.user._id.toString()
    );

    if (existingEndorsement) {
      // Remove endorsement if it exists (toggle functionality)
      branch.endorsements = branch.endorsements.filter(
        (e) => e.userId.toString() !== req.user._id.toString()
      );
      await branch.save();
      return res.send({ endorsed: false, endorsements: branch.endorsements });
    }

    // Add new endorsement
    branch.endorsements.push({
      userId: req.user._id,
      name: req.user.name,
      timestamp: new Date(),
    });

    await branch.save();
    res.send({ endorsed: true, endorsements: branch.endorsements });
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

// get a single twig by id
router.get("/twig/:twigId", async (req, res) => {
  try {
    const twig = await Twig.findById(req.params.twigId).populate("leaves");
    if (!twig) {
      return res.status(404).send({ error: "Twig not found" });
    }
    res.send(twig);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// update a twig
router.put("/twig/:twigId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const twig = await Twig.findById(req.params.twigId);
    if (!twig) {
      return res.status(404).send({ error: "Twig not found" });
    }
    twig.name = req.body.name;
    twig.description = req.body.description;
    await twig.save();
    res.send(twig);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// delete a twig
router.delete("/twig/:twigId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const twig = await Twig.findById(req.params.twigId).populate("leaves");
    if (!twig) {
      return res.status(404).send({ error: "Twig not found" });
    }

    // make sure to delete all associated leaves
    if (twig.leaves && twig.leaves.length > 0) {
      await Leaf.deleteMany({ _id: { $in: twig.leaves } });
    }

    // Remove twig reference from branch
    await Branch.findByIdAndUpdate(twig.branchId, {
      $pull: { twigs: twig._id },
    });

    // Delete the twig
    await Twig.findByIdAndDelete(req.params.twigId);
    res.send({ message: "Twig and all associated leaves deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// create a new leaf
router.post("/leaf", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const twig = await Twig.findById(req.body.twigId);
    if (!twig) {
      return res.status(404).send({ error: "Twig not found" });
    }

    // create a new leaf object
    const leaf = await Leaf.create({
      name: req.body.name,
      description: req.body.description,
      link: req.body.link,
    });

    // add its ObjectId to the twig's leaves array
    twig.leaves.push(leaf._id);
    await twig.save();

    // return the populated leaf object
    res.send(leaf);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// get a single leaf by id
router.get("/leaf/:leafId", async (req, res) => {
  try {
    const leaf = await Leaf.findById(req.params.leafId);
    if (!leaf) {
      return res.status(404).send({ error: "Leaf not found" });
    }
    res.send(leaf);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// update a leaf
router.put("/leaf/:leafId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const leaf = await Leaf.findById(req.params.leafId);
    if (!leaf) {
      return res.status(404).send({ error: "Leaf not found" });
    }
    leaf.name = req.body.name;
    leaf.description = req.body.description;
    leaf.link = req.body.link;
    await leaf.save();
    res.send(leaf);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// delete a leaf
router.delete("/leaf/:leafId", async (req, res) => {
  if (!req.user) {
    return res.status(401).send({ error: "Error: You must be logged in" });
  }
  try {
    const leaf = await Leaf.findById(req.params.leafId);
    if (!leaf) {
      return res.status(404).send({ error: "Leaf not found" });
    }

    // remove leaf reference from twig
    await Twig.findOneAndUpdate({ leaves: leaf._id }, { $pull: { leaves: leaf._id } });

    // delete the leaf
    await Leaf.findByIdAndDelete(req.params.leafId);
    res.send({ message: "Leaf deleted successfully" });
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
      const searchRegex = new RegExp(searchQuery, "i");
      console.log("Using regex:", searchRegex);

      users = await User.find({
        name: { $regex: searchRegex },
      }).select("name _id");

      console.log("MongoDB query:", {
        name: { $regex: searchRegex },
      });
      console.log("Found users:", users);
    } else {
      users = await User.find({}).select("name _id");
      console.log("Found all users:", users);
    }

    const trees = users.map((user) => ({
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

// get user info by id
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send({ _id: user._id, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// get user info by id
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send({ _id: user._id, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: `Error: ${err}` });
  }
});

// Send friend request
router.post("/friend-request", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { friendId } = req.body;
    const mongoose = require("mongoose");

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

    const existingFriend = user.friends.find(
      (friend) => friend.userId.toString() === friendObjectId.toString()
    );

    if (existingFriend) {
      return res.status(400).send({
        error: `Already ${existingFriend.status === "pending" ? "sent a request" : "friends"}`,
      });
    }

    // Add friend request
    user.friends.push({ userId: friendObjectId, status: "pending" });
    await user.save();

    res.send({ message: "Friend request sent" });
  } catch (err) {
    console.log(`Failed to send friend request: ${err}`);
    if (err.name === "CastError") {
      return res.status(400).send({ error: "Invalid user ID format" });
    }
    res.status(500).send({ error: "Failed to send friend request" });
  }
});

// Get friend status
router.get("/friend-status", auth.ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Get incoming friend requests (where other users have current user in their friends array with pending status)
    const incomingRequests = await User.find({
      friends: {
        $elemMatch: {
          userId: user._id,
          status: "pending",
        },
      },
    }).select("name _id");

    // Safely process user's friends list, handling potentially malformed data
    const friendsList = await Promise.all(
      user.friends.map(async (friend) => {
        try {
          // Check if friend.userId exists and is valid
          if (!friend.userId) return null;

          const friendUser = await User.findById(friend.userId).select("name _id");
          if (!friendUser) return null;

          return {
            _id: friendUser._id,
            name: friendUser.name,
            status: friend.status || "pending", // Default to pending if status is missing
          };
        } catch (err) {
          console.log(`Error processing friend ${friend.userId}: ${err}`);
          return null;
        }
      })
    );

    // Filter out any null values from invalid friends
    const validFriendsList = friendsList.filter((friend) => friend !== null);

    res.send({
      friends: validFriendsList.filter((f) => f.status === "accepted"),
      pendingRequests: validFriendsList.filter((f) => f.status === "pending"),
      incomingRequests: incomingRequests,
    });
  } catch (err) {
    console.log(`Failed to get friend status: ${err}`);
    res.status(500).send({ error: "Failed to get friend status" });
  }
});

// Accept friend request
router.post("/accept-friend", auth.ensureLoggedIn, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).send({ error: "User not found" });
    }

    // Add friend to current user's friends list with accepted status
    user.friends.push({ userId: friendId, status: "accepted" });
    await user.save();

    // Update the status of the friend request to accepted
    const friendRequest = friend.friends.find(
      (f) => f.userId.toString() === user._id.toString() && f.status === "pending"
    );
    if (friendRequest) {
      friendRequest.status = "accepted";
      await friend.save();
    }

    res.send({ message: "Friend request accepted" });
  } catch (err) {
    console.log(`Failed to accept friend request: ${err}`);
    res.status(500).send({ error: "Failed to accept friend request" });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
