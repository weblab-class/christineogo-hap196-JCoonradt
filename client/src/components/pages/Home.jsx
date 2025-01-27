import React, { useContext, useState, useEffect, useCallback, lazy, Suspense, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import noBranch from "../../assets/tree/noBranch.png";
import oneBranch from "../../assets/tree/oneBranch.png";
import twoBranch from "../../assets/tree/twoBranch.png";
import threeBranch from "../../assets/tree/threeBranch.png";
import fourBranch from "../../assets/tree/fourBranch.png";
import fiveBranch from "../../assets/tree/fiveBranch.png";
import sixBranch from "../../assets/tree/sixBranch.png";
import background from "../../assets/treeBackground.png";
import racoonImg from "../../assets/racoon.gif";
import rabbitImg from "../../assets/rabbit.gif";
import owlImg from "../../assets/owl.gif";
import treeGrow from "../../assets/treeGrow1.mp3";

// Lazy-loaded components
const CustomButton = lazy(() => import("../modules/CustomButton"));
const Navbar = lazy(() => import("../modules/Navbar"));
const Login = lazy(() => import("./Login"));
const WoodenSign = lazy(() => import("../modules/WoodenSign"));
const MusicButton = lazy(() => import("../modules/MusicButton"));

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

  //Tutorial state variables and steps
  const [tutorialActive, setTutorialActive] = useState(false);
  const tutorialActiveRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const steps = [
    {
      message: "Click the add branch button above to create a new branch.",
      top: "40%",
      left: "75%",
    },
    {
      message:
        "Title and describe your branch. Branches are for general skills areas like finance, research, or website development",
      top: "50%",
      left: "40%",
    },
    {
      message:
        "Great! Now, click on the title of the branch you just created to zoom in and see your twigs",
      top: "62%",
      left: "33%",
    },
    {
      message:
        "Fantastic! Now, pres the add twig button to add a twig to cover a more specific category of the general skill area like options trading for finance, climate science research for research or MERN stack for website development.",
      top: "20%",
      left: "10%",
    },
    {
      message:
        "Awesome! Now you can add a leaf with specific projects on that twig. For example, on an options trading twig I could put an algorithm I made, on a climate science research twig I could put an energy analysis project I completed, and for a MERN Stack twig I could put this amazing website that my team and I created!",
      top: "20%",
      left: "10%",
    },
    {
      message:
        "You can always use the navigation bar up here to select forest and visit your friends' trees. You're all set! Have fun exploring.",
      top: "20%",
      left: "10%",
    },
  ];
  const startTutorial = () => {
    console.log("Starting tutorial...");
    setTutorialActive(true);
    tutorialActiveRef.current = true; // Set tutorialActive to true
    setCurrentStep(0); // Reset tutorial step
    console.log("Tutorial active:", tutorialActiveRef.current);
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setTutorialActive(false); // End tutorial
    }
  };

  const soundRef = useRef(null);
  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0; // Reset the sound to the beginning
      soundRef.current.play();
    }
  };

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
    console.log("Current step" + currentStep);
    setCurrentStep(1);
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
        console.log("Current step" + currentStep);
        playSound();
        setCurrentStep(2);
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
      console.log("Navigating with tutorialActive:", tutorialActive);
      navigate(`/tree/${userId}/branch/${branchId}`, {
        state: {
          branchType: index + 1,
          tutorialActive: tutorialActiveRef.current, // Ensure this value is correct
          currentStep: 3,
        },
      });
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
        <Navbar startTutorial={startTutorial} />
      </Suspense>

      <img
        className="background-image"
        src={branchImages[currentImageIndex]}
        alt="Tree with branches"
      />
      <div>
        {/* Rabbit */}
        <img src={rabbitImg} alt="Rabbit" className="rabbit" />

        {/* Other content */}
      </div>

      <div>
        {/* Owl */}
        <img src={owlImg} alt="Owl" className="owl" />

        {/* Other content */}
      </div>
      <div className="add-branch-container">
        <Suspense fallback={<div>Loading Button...</div>}>
          <CustomButton
            text="Add Branch"
            onClick={handleAddBranch}
            disabled={currentImageIndex >= 6}
          />
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

      {branchHitboxes.slice(0, currentImageIndex).map((hitbox, index) => (
        <div
          key={index}
          className={`branch-hitbox branch-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          style={{
            // during the tutorial, the hitbox should be above the navbar
            zIndex: tutorialActive ? 1001 : 504,
          }}
          onMouseEnter={() => branches[index] && handleBranchHover(branches[index])}
          onMouseLeave={handleBranchHoverEnd}
          onClick={() => branches[index] && handleBranchClick(branches[index]._id, index)}
        >
          {branches[index]?.name}
        </div>
      ))}
      <MusicButton />
      {/* Hidden audio element for sound effect */}
      <audio ref={soundRef}>
        <source src={treeGrow} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Tutorial Overlay */}
      {tutorialActive && (
        <div className="tutorial-overlay">
          <div
            className="tutorial-animal"
            style={{
              top: steps[currentStep].top,
              left: steps[currentStep].left,
              position: "absolute",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <img
              src={racoonImg}
              style={{ zIndex: 1000 }}
              alt="Animal Guide"
              className="animal-image"
            />
            <div className="tutorial-message" style={{ zIndex: 1000 }}>
              {steps[currentStep].message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Home;
