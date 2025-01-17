import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
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

  const handleMenuClose = () => {
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
              <Link to="/logout">Logout</Link>
              <img src="/chevronWhite.png" alt="Close menu" className="chevron-rotated" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
