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

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
