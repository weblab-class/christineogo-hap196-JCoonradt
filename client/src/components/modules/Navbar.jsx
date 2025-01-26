import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Navbar.css";
import chevronGrey from "../../assets/chevronGrey.png";

const Navbar = ({ startTutorial }) => {
  const { userId, handleLogout } = useContext(UserContext);
  const [tutorialStarted, setTutorialStarted] = useState(false);

  const handleTutorialStart = () => {
    setTutorialStarted(true);
    startTutorial();
  };

  const handleLogoutClick = () => {
    googleLogout();
    handleLogout();
  };

  return (
    <div className={`navbar ${tutorialStarted ? "navbar-no-hover" : ""}`}>
      <img src={chevronGrey} alt="Chevron Icon" className="chevron" />
      <div className="menu">
        <h2>MENU</h2>
        <div className="menu-links-div">
          <Link to="/">My Tree</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/forest">Forest</Link>
          {userId && (
            <Link to="/" onClick={handleLogoutClick}>
              Logout
            </Link>
          )}
          <Link to="/" onClick={handleTutorialStart}>
            Tutorial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
