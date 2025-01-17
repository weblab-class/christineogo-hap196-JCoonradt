import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Navbar.css";

const Navbar = () => {
  const { userId, handleLogout } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // hook to open menu at a delay so it doesn't open immediately
  useEffect(() => {
    let timeout;
    if (isHovering) {
      timeout = setTimeout(() => {
        setIsMenuOpen(true);
        // 2 second delay
      }, 200);
    } else {
      setIsMenuOpen(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isHovering]);

  // close menu function. use when arrow is clicked
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  // logout function
  const handleLogoutClick = () => {
    googleLogout();
    handleLogout();
    setIsMenuOpen(false);
  };

  return (
    <div
      className="navbar"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {!isMenuOpen && <img src="/chevronGrey.png" alt="Menu" className="grey chevron" />}
      {isMenuOpen && (
        <>
          <div className="menu">
            <h2>MENU</h2>
            <div className="menu-links-div">
              <Link to="/my-tree">My Tree</Link>
              <Link to="/forest">Forest</Link>
              {userId && (
                <Link to="/" onClick={handleLogoutClick}>
                  Logout
                </Link>
              )}
              <img src="/chevronWhite.png" alt="Close menu" className="chevron-rotated" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
