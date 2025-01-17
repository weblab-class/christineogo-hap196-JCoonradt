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

const branchImages = [noBranch, oneBranch, twoBranch, threeBranch, fourBranch, fiveBranch, sixBranch];

const Home = () => {
  const { userId } = useContext(UserContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddBranch = () => {
    setCurrentImageIndex((prevIndex) => {
      if (prevIndex < branchImages.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  if (!userId) {
    return <Login />;
  }

  return (
    <>
      <Navbar />
      <img className="background-image" src="/background.png" alt="Background" />
      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
      <CustomButton text="Add Branch" onClick={handleAddBranch} className="add-branch-button"/>
    </>
  );
};

export default Home;
