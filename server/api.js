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
// | write your API methods below!|
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


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
