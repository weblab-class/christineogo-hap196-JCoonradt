import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import noBranch from "/noBranch.png";
import oneBranch from "/oneBranch.png";
import twoBranch from "/twoBranch.png";
import threeBranch from "/threeBranch.png";
import fourBranch from "/fourBranch.png";
import fiveBranch from "/fiveBranch.png";
import sixBranch from "/sixBranch.png";
import CustomButton from "../modules/CustomButton";
import Navbar from "../modules/Navbar";
import Login from "./Login";
import WoodenSign from "../modules/WoodenSign";
const branchImages = [
  noBranch,
  oneBranch,
  twoBranch,
  threeBranch,
  fourBranch,
  fiveBranch,
  sixBranch,
];

// when i hover over a branch, hitboxes will detect the hover and display the wooden sign
const branchHitboxes = [
  { top: "500px", left: "400px" },
  { top: "610px", left: "1100px" },
  { top: "250px", left: "350px" },
  { top: "400px", left: "1150px" },
  { top: "40px", left: "400px" },
  { top: "50px", left: "1100px" },
];

const Home = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWoodenSign, setShowWoodenSign] = useState(false);
  const [branches, setBranches] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // states to manage what is displayed in the wooden sign
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

  // hook to get the user's tree. use this to update the tree image with correct number of branches
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch(`/apiHome/tree/${userId}`);
        if (response.ok) {
          const treeData = await response.json();
          // get the number of branches in the tree
          const numBranches = treeData.branches.length;
          setCurrentImageIndex(Math.min(numBranches, 6));
          setBranches(treeData.branches);
        } else {
          console.error("Failed to fetch tree data");
        }
      } catch (error) {
        console.error("Failed to fetch tree data:", error);
      }
    };

    if (userId) {
      fetchTree();
    }
  }, [userId]);

  const handleAddBranch = () => {
    setIsEditMode(true);
    setBranchName("");
    setBranchDescription("");
    setShowWoodenSign(true);
  };

  // handle the submit of a new branch
  const handleSubmitBranch = async (title, description) => {
    try {
      // make a post request to the server to add a new branch
      const response = await fetch("/api/branch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: title,
          description: description,
        }),
      });

      if (response.ok) {
        // get the updated tree
        const treeResponse = await fetch(`/apiHome/tree/${userId}`);
        if (treeResponse.ok) {
          const treeData = await treeResponse.json();
          const numBranches = treeData.branches.length;
          // update the tree image with the correct number of branches
          setCurrentImageIndex(Math.min(numBranches, 6));
        }

        setShowWoodenSign(false);
        setBranchName("");
        setBranchDescription("");
        setIsEditMode(false);
      } else {
        const error = await response.json();
        console.error("Failed to save branch:", error);
      }
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  // handle the hover of a branch
  const handleBranchHover = (branch) => {
    setIsEditMode(false);
    setBranchName(branch.name);
    setBranchDescription(branch.description);
    setShowWoodenSign(true);
  };

  // handle when we stop hovering over a branch
  const handleBranchHoverEnd = () => {
    setShowWoodenSign(false);
    setBranchName("");
    setBranchDescription("");
  };

  // click handler for branches
  const handleBranchClick = (branchId) => {
    // navigate to the branch view
    navigate(`Home/tree/${userId}/branch/${branchId}`);
  };

  // if the user is not logged in, show the login page
  if (!userId) {
    return <Login />;
  }

  // if the user is logged in, show the home page
  return (
    <div>
      <Navbar />
      <img className="background-image" src="/background.png" alt="Background" />
      <div className="add-branch-container">
        <CustomButton text="Add Branch" onClick={handleAddBranch} />
      </div>
      {showWoodenSign && (
        <WoodenSign
          title={branchName}
          description={branchDescription}
          onSubmit={handleSubmitBranch}
          onCancel={() => {
            setShowWoodenSign(false);
            setIsEditMode(false);
          }}
          readOnly={!isEditMode}
          initialEditMode={isEditMode}
        />
      )}
      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
      {branchHitboxes.slice(0, currentImageIndex).map((hitbox, index) => (
        <div
          key={index}
          // when we're editing, we don't want to be able to click on the hitboxes so disable pointer events until we click submit
          className={`branch-hitbox branch-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          onMouseEnter={() => branches[index] && handleBranchHover(branches[index])}
          onMouseLeave={handleBranchHoverEnd}
          onClick={() => branches[index] && handleBranchClick(branches[index]._id)}
        >
          {branches[index]?.name}
        </div>
      ))}
    </div>
  );
};

export default Home;
