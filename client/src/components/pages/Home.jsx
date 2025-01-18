import React, { useContext, useState, useEffect } from "react";

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

const Home = () => {
  const { userId } = useContext(UserContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWoodenSign, setShowWoodenSign] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

  // hook to get the user's tree. use this to update the tree image with correct number of branches
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch(`/api/tree/${userId}`);
        if (response.ok) {
          const treeData = await response.json();
          // get the number of branches in the tree
          const numBranches = treeData.branches.length;
          setCurrentImageIndex(Math.min(numBranches, 6));
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
        const treeResponse = await fetch(`/api/tree/${userId}`);
        if (treeResponse.ok) {
          const treeData = await treeResponse.json();
          const numBranches = treeData.branches.length;
          // update the tree image with the correct number of branches
          setCurrentImageIndex(Math.min(numBranches, 6));
        }

        setShowWoodenSign(false);
        setBranchName("");
        setBranchDescription("");
      } else {
        const error = await response.json();
        console.error("Failed to save branch:", error);
      }
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  if (!userId) {
    return <Login />;
  }

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
          onCancel={() => setShowWoodenSign(false)}
        />
      )}
      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
    </div>
  );
};

export default Home;
