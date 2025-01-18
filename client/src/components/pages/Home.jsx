import React, { useContext, useState } from "react";

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

  const handleAddBranch = () => {
    setShowWoodenSign(true);
  };

  const handleSubmitBranch = async (title, description) => {
    try {
      // send post request to create new branch
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
        // increment tree image if not at max branches
        setCurrentImageIndex((prevIndex) => {
          if (prevIndex < branchImages.length - 1) {
            return prevIndex + 1;
          }
          return prevIndex;
        });
        // reset form and hide wooden sign
        setShowWoodenSign(false);
        setBranchName("");
        setBranchDescription("");
      } else {
        // handle error response
        const error = await response.json();
        console.error("Failed to save branch:", error);
      }
    } catch (error) {
      // handle network/other errors
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
