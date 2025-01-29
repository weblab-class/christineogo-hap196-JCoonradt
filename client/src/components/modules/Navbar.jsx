import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Navbar.css";
import chevronGrey from "../../assets/chevronGrey.png";

const Navbar = ({ startTutorial }) => {
  const { userId, handleLogout } = useContext(UserContext);
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const location = useLocation();

  const handleTutorialStart = () => {
    setTutorialStarted(true);
    startTutorial();
  };

  const handleLogoutClick = () => {
    googleLogout();
    handleLogout();
  };

  const isActive = (path) => {
    // check if we're in a friend's tree view. if so, highlight Forest
    if (path === "/forest" && location.pathname.includes("/friend/")) {
      return true;
    }

    // check if we're in branch/twig/leaf view or at the root. if so, highlight My Tree
    if (
      path === "/" &&
      (location.pathname === "/" ||
        location.pathname.includes("/tree/") ||
        location.pathname.includes("/branch/") ||
        location.pathname.includes("/twig/") ||
        location.pathname.includes("/leaf/")) &&
      !location.pathname.includes("/friend/")
    ) {
      return true;
    }

    return location.pathname === path;
  };

  return (
    <div className={`navbar ${tutorialStarted ? "navbar-no-hover" : ""}`}>
      {/* <h2 className="closed-title">MENU</h2> */}
      <img src={chevronGrey} alt="Chevron Icon" className="chevron" />
      <div className="menu">
        <h2>MENU</h2>
        <div className="menu-links-div">
          <Link to="/" className={isActive("/") ? "active" : ""}>
            My Tree
          </Link>
          <Link to="/stats" className={isActive("/stats") ? "active" : ""}>
            Stats
          </Link>
          <Link to="/forest" className={isActive("/forest") ? "active" : ""}>
            Forest
          </Link>
          {userId && (
            <Link to="/" onClick={handleLogoutClick}>
              Logout
            </Link>
          )}
          <Link to="/" onClick={handleTutorialStart}>
            Tutorial
          </Link>
        </div>
        <img
          src={chevronGrey}
          alt="Bottom Chevron"
          className="bottom-chevron"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>
    </div>
  );
};

export default Navbar;
