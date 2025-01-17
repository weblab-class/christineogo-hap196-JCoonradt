import React, { useContext, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import background from "/background.png";
import noBranch from "/noBranch.png";
import oneBranch from "/oneBranch.png";
import twoBranch from "/twoBranch.png";
import threeBranch from "/threeBranch.png";
import fourBranch from "/fourBranch.png";
import fiveBranch from "/fiveBranch.png";
import sixBranch from "/sixBranch.png";
import CustomButton from "../modules/CustomButton";
import Navbar from "../modules/Navbar";

const branchImages = [noBranch, oneBranch, twoBranch, threeBranch, fourBranch, fiveBranch, sixBranch];

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddBranch = () => {
    setCurrentImageIndex((prevIndex) => {
      // do not go past the last image
      if (prevIndex < branchImages.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  return (
    <>
      <Navbar />
      {userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )}
      <img className="background-image" src={background} alt="Background" />
      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
      <CustomButton text="Add Branch" onClick={handleAddBranch} className="add-branch-button"/>
    </>
  );
};

export default Home;
