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
import racoonImg from "../../assets/racoon.gif";
import rabbitImg from "../../assets/rabbit.gif";
import owlImg from "../../assets/owl.gif";
import treeGrow from "../../assets/treeGrow1.mp3";
import smallOneBranch from "../../assets/tree/smallScreen/smallOneBranch.png";
import smallTwoBranch from "../../assets/tree/smallScreen/smallTwoBranch.png";
import smallThreeBranch from "../../assets/tree/smallScreen/smallThreeBranch.png";
import smallFourBranch from "../../assets/tree/smallScreen/smallFourBranch.png";
import smallFiveBranch from "../../assets/tree/smallScreen/smallFiveBranch.png";
import smallSixBranch from "../../assets/tree/smallScreen/smallSixBranch.png";

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

const smallScreenBranchImages = [
  noBranch,
  smallOneBranch,
  smallTwoBranch,
  smallThreeBranch,
  smallFourBranch,
  smallFiveBranch,
  smallSixBranch,
];

const branchHitboxes = [
  { top: "50%", left: "26%" }, // branch 0
  { top: "57%", right: "26%" }, // branch 1
  { top: "27%", left: "24%" }, // branch 2
  { top: "40%", right: "26%" }, // branch 3
  { top: "8%", left: "26%" }, // branch 4
  { top: "10%", right: "26%" }, // branch 5
];

const Home = React.memo(() => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWoodenSign, setShowWoodenSign] = useState(false);
  const [branches, setBranches] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [noBranches, setNoBranches] = useState(false);

  //Tutorial state variables and steps
  const [tutorialActive, setTutorialActive] = useState(false);
  const tutorialActiveRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const steps = [
    {
      message: "Click the add branch button above to create a new branch.",
      top: "65%",
      left: "35%",
    },
    {
      message:
        "Title and describe your branch. Branches are for general skills areas like finance, research, or website development",
      top: "50%",
      left: "60%",
    },
    {
      message:
        "Great! Now, click on the title of the branch you just created to zoom in and see your twigs",
      top: "62%",
      left: "0%",
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

  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // get the correct image array given a screen size
  const getCurrentBranchImage = () => {
    return windowWidth <= 800
      ? smallScreenBranchImages[currentImageIndex]
      : branchImages[currentImageIndex];
  };

  // Fetch the user's tree data
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch(`/api/tree/${userId}`);
        if (response.ok) {
          const treeData = await response.json();
          const numBranches = treeData.branches.length;
          if (numBranches == 0) {
            setNoBranches(true);
            console.log("this kit got no branches");
          }
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

  //Handle submitting a branch
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
        className={`background-image ${currentImageIndex}-branches`}
        src={getCurrentBranchImage()}
        alt="Tree with branches"
      />
      <div>
        {/* Rabbit */}
        <img src={rabbitImg} alt="Rabbit" className="rabbit" />

        {/* Other content */}
      </div>

      <div>
        {/* Owl */}

        {noBranches && (
          <div>
            <img src={owlImg} alt="Owl" className="owl" />
            <div className="tutorial-start-message">
              It looks like you are yet to start branching out your tree. If you need help getting
              started, go to the menu to start our tutorial. Hoot Hoot!
            </div>
          </div>
        )}

        {!noBranches && <img src={owlImg} alt="Owl" className="owl" />}

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
