import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { get } from "../../utilities";

import "../../utilities.css";
import "./Home.css";
import "./Branch.css";  
import noBranch from "../../assets/noBranch.png";
import oneBranch from "../../assets/oneBranch.png";
import twoBranch from "../../assets/twoBranch.png";
import threeBranch from "../../assets/threeBranch.png";
import fourBranch from "../../assets/fourBranch.png";
import fiveBranch from "../../assets/fiveBranch.png";
import sixBranch from "../../assets/sixBranch.png";
import background from "../../assets/treeBackground.png";

// Lazy-loaded components
const Navbar = lazy(() => import("../modules/Navbar"));
const WoodenSign = lazy(() => import("../modules/WoodenSign"));

const branchImages = [
  noBranch,
  oneBranch,
  twoBranch,
  threeBranch,
  fourBranch,
  fiveBranch,
  sixBranch,
];

// Branch type mapping based on position
const branchTypeMapping = [1, 2, 3, 4, 5, 6];

// Branch hitbox positions
const branchHitboxPositions = [
  { top: "50%", left: "25%" },    // Branch 1 (right side)
  { top: "57%", left: "62%" },    // Branch 2 (left side)
  { top: "27%", left: "23%" },    // Branch 3 (right side)
  { top: "40%", left: "63%" },    // Branch 4 (left side)
  { top: "8%", left: "26%" },     // Branch 5 (right side)
  { top: "10%", left: "62%" },    // Branch 6 (left side)
];

const FriendTree = React.memo(() => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWoodenSign, setShowWoodenSign] = useState(false);
  const [branches, setBranches] = useState([]);
  const [friendName, setFriendName] = useState(location.state?.friendName || "");

  // States to manage wooden sign content
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

  // Fetch the friend's tree data and name if not provided in state
  useEffect(() => {
    const fetchTreeAndUser = async () => {
      try {
        console.log("Fetching tree data for user:", userId);
        const [treeData, userData] = await Promise.all([
          get("/api/tree/" + userId),
          !location.state?.friendName ? get("/api/user/" + userId) : Promise.resolve(null)
        ]);
        
        console.log("Received tree data:", treeData);
        
        if (treeData) {
          const numBranches = treeData.branches.length;
          console.log("Number of branches:", numBranches);
          console.log("Branch data:", treeData.branches);
          setCurrentImageIndex(Math.min(numBranches, 6));
          setBranches(treeData.branches);
        } else {
          console.error("No tree data received");
        }

        if (!location.state?.friendName && userData) {
          setFriendName(userData.name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (userId) {
      fetchTreeAndUser();
    }
  }, [userId, location.state?.friendName]);

  // Handle branch hover
  const handleBranchHover = useCallback((branch) => {
    setBranchName(branch.name);
    setBranchDescription(branch.description);
    setShowWoodenSign(true);
  }, []);

  // Handle hover end
  const handleBranchHoverEnd = useCallback(() => {
    setShowWoodenSign(false);
    setBranchName("");
    setBranchDescription("");
  }, []);

  // Handle branch click
  const handleBranchClick = useCallback(
    (branchId, index) => {
      navigate(`/friend/${userId}/tree/branch/${branchId}`, { 
        state: { 
          branchType: branchTypeMapping[index],
          friendName: friendName,
          userId: userId
        }
      });
    },
    [navigate, userId, friendName]
  );

  return (
    <div>
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <Navbar />
      </Suspense>
      <img className="background-image" src={background} alt="Background" />
      <div className="wooden-sign-container-home">
        {showWoodenSign && (
          <Suspense fallback={<div>Loading Wooden Sign...</div>}>
            <WoodenSign
              title={branchName}
              description={branchDescription}
              readOnly={true}
            />
          </Suspense>
        )}
      </div>

      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
      
      {/* Branch hitboxes */}
      {branchHitboxPositions.slice(0, currentImageIndex).map((position, index) => (
        <div
          key={index}
          className="branch-hitbox"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: '200px',
            height: '200px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            fontSize: 'var(--l)',
            zIndex: 1,
          }}
          onMouseEnter={() => branches[index] && handleBranchHover(branches[index])}
          onMouseLeave={handleBranchHoverEnd}
          onClick={() => branches[index] && handleBranchClick(branches[index]._id, index)}
        >
          {branches[index]?.name}
        </div>
      ))}
      
      <div className="friend-name-label">
        {friendName}'s Tree
      </div>
    </div>
  );
});

export default FriendTree;
