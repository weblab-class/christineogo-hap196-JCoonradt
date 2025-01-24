import React, { useContext, useState, useEffect, useCallback, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import noBranch from "../../assets/noBranch.png";
import oneBranch from "../../assets/oneBranch.png";
import twoBranch from "../../assets/twoBranch.png";
import threeBranch from "../../assets/threeBranch.png";
import fourBranch from "../../assets/fourBranch.png";
import fiveBranch from "../../assets/fiveBranch.png";
import sixBranch from "../../assets/sixBranch.png";
import background from "../../assets/treeBackground.png";

// Lazy-loaded components
const CustomButton = lazy(() => import("../modules/CustomButton"));
const Navbar = lazy(() => import("../modules/Navbar"));
const Login = lazy(() => import("./Login"));
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

// Hitbox positions for branches
const branchHitboxes = [
  { top: "500px", left: "400px" },
  { top: "610px", left: "1100px" },
  { top: "250px", left: "350px" },
  { top: "400px", left: "1150px" },
  { top: "40px", left: "400px" },
  { top: "50px", left: "1100px" },
];

const Home = React.memo(() => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWoodenSign, setShowWoodenSign] = useState(false);
  const [branches, setBranches] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // States to manage wooden sign content
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

  // Fetch the user's tree data
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch(`/api/tree/${userId}`);
        if (response.ok) {
          const treeData = await response.json();
          const numBranches = treeData.branches.length;
          setCurrentImageIndex(Math.min(numBranches, 6));
          setBranches(treeData.branches);
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

  // Handle adding a new branch
  const handleAddBranch = useCallback(() => {
    setIsEditMode(true);
    setBranchName("");
    setBranchDescription("");
    setShowWoodenSign(true);
  }, []);

  // Handle submitting a branch
  const handleSubmitBranch = useCallback(
    async (title, description) => {
      try {
        const response = await fetch("/api/branch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ name: title, description }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to save branch:", error);
          return;
        }

        const treeResponse = await fetch(`/api/tree/${userId}`);
        if (treeResponse.ok) {
          const treeData = await treeResponse.json();
          const numBranches = treeData.branches.length;
          setCurrentImageIndex(Math.min(numBranches, 6));
          setBranches(treeData.branches);
        } else {
          console.error("Failed to fetch updated tree data");
        }

        setShowWoodenSign(false);
        setBranchName("");
        setBranchDescription("");
        setIsEditMode(false);
      } catch (error) {
        console.error("Error handling branch submission:", error);
      }
    },
    [userId]
  );

  // Handle branch hover
  const handleBranchHover = useCallback((branch) => {
    setIsEditMode(false);
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
      navigate(`/tree/${userId}/branch/${branchId}`, { state: { branchType: index + 1 } });
    },
    [navigate, userId]
  );

  // Render the login page if the user is not logged in
  if (!userId) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    );
  }

  // Render the home page
  return (
    <div>
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <Navbar />
      </Suspense>
      <img className="background-image" src={background} alt="Background" />
      <div className="add-branch-container">
        <Suspense fallback={<div>Loading Button...</div>}>
          <CustomButton text="Add Branch" onClick={handleAddBranch} />
        </Suspense>
      </div>
      <div className="wooden-sign-container-home">
        {showWoodenSign && (
          <Suspense fallback={<div>Loading Wooden Sign...</div>}>
            <WoodenSign
              title={branchName}
              description={branchDescription}
              onSubmit={handleSubmitBranch}
              onCancel={() => {
                setShowWoodenSign(false);
                setIsEditMode(false);
              }}
              readOnly={!isEditMode}
              initialEditMode={isEditMode}
            />
          </Suspense>
        )}
      </div>

      <img className="tree-image" src={branchImages[currentImageIndex]} alt="Tree with branches" />
      {branchHitboxes.slice(0, currentImageIndex).map((hitbox, index) => (
        <div
          key={index}
          className={`branch-hitbox branch-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          onMouseEnter={() => branches[index] && handleBranchHover(branches[index])}
          onMouseLeave={handleBranchHoverEnd}
          onClick={() => branches[index] && handleBranchClick(branches[index]._id, index)}
        >
          {branches[index]?.name}
        </div>
      ))}
    </div>
  );
});

export default Home;
