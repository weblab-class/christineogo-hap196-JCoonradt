import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Navbar.css";
import chevronGrey from "../../assets/chevronGrey.png";
import chevronWhite from "../../assets/chevronWhite.png";

const Navbar = ({ startTutorial }) => {
  const { userId, handleLogout } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tutorialStarted, setTutorialStarted] = useState(false);

  // Open/close the menu based on hover state and tutorial state
  useEffect(() => {
    let timeout;
    if (isHovering && !tutorialStarted) {
      timeout = setTimeout(() => {
        setIsMenuOpen(true);
      }, 200); // 200ms delay
    } else {
      setIsMenuOpen(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isHovering, tutorialStarted]);

  // Close the menu
  const handleMenuClose = () => {
    setIsMenuOpen(false);
    setIsHovering(false); // Ensure the hover effect is reset
  };

  // Logout handler
  const handleLogoutClick = () => {
    googleLogout();
    handleLogout();
    handleMenuClose();
  };

  // Start tutorial and close the menu
  const handleTutorialStart = () => {
    handleMenuClose(); // Close the menu and overlay
    setTutorialStarted(true); // Mark the tutorial as started
    startTutorial(); // Start the tutorial
  };

  return (
    <div
      className="navbar"
      onMouseEnter={() => !tutorialStarted && setIsHovering(true)} // Disable hover if tutorial has started
      onMouseLeave={() => setIsHovering(false)} // Disable hover if tutorial has started
    >
      {!isMenuOpen || tutorialStarted ? (
        <img src={chevronGrey} alt="Menu" className="grey chevron" />
      ) : (
        isMenuOpen &&
        !tutorialStarted && (
          <>
            <div className="menu">
              <h2>MENU</h2>
              <div className="menu-links-div">
                {/* Start tutorial when "Tutorial" link is clicked */}
                <Link to="/" onClick={handleTutorialStart}>
                  Tutorial
                </Link>
                <Link to="/">My Tree</Link>
                <Link to="/stats">Stats</Link>
                <Link to="/forest">Forest</Link>
                {userId && (
                  <Link to="/" onClick={handleLogoutClick}>
                    Logout
                  </Link>
                )}
                <img src={chevronWhite} alt="Close menu" className="chevron-rotated" />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default Navbar;
