import { React, useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Branch.css";
import WoodenSign from "../modules/WoodenSign";

import branchOneNoTwigs from "../../assets/branches/branchOne/branchOneNoTwigs.png";
import branchOneTwigOne from "../../assets/branches/branchOne/branchOneTwigOne.png";
import branchOneTwigTwo from "../../assets/branches/branchOne/branchOneTwigTwo.png";
import branchOneTwigThree from "../../assets/branches/branchOne/branchOneTwigThree.png";
import branchOneTwigFour from "../../assets/branches/branchOne/branchOneTwigFour.png";
import branchOneTwigFive from "../../assets/branches/branchOne/branchOneTwigFive.png";
import branchOneTwigSix from "../../assets/branches/branchOne/branchOneTwigSix.png";
import branchTwoNoTwigs from "../../assets/branches/branchTwo/branchTwoNoTwigs.png";
import branchTwoTwigOne from "../../assets/branches/branchTwo/branchTwoTwigOne.png";
import branchTwoTwigTwo from "../../assets/branches/branchTwo/branchTwoTwigTwo.png";
import branchTwoTwigThree from "../../assets/branches/branchTwo/branchTwoTwigThree.png";
import branchTwoTwigFour from "../../assets/branches/branchTwo/branchTwoTwigFour.png";
import branchTwoTwigFive from "../../assets/branches/branchTwo/branchTwoTwigFive.png";
import branchTwoTwigSix from "../../assets/branches/branchTwo/branchTwoTwigSix.png";
import branchThreeNoTwigs from "../../assets/branches/branchThree/branchThreeNoTwigs.png";
import branchThreeTwigOne from "../../assets/branches/branchThree/branchThreeTwigOne.png";
import branchThreeTwigTwo from "../../assets/branches/branchThree/branchThreeTwigTwo.png";
import branchThreeTwigThree from "../../assets/branches/branchThree/branchThreeTwigThree.png";
import branchThreeTwigFour from "../../assets/branches/branchThree/branchThreeTwigFour.png";
import branchThreeTwigFive from "../../assets/branches/branchThree/branchThreeTwigFive.png";
import branchThreeTwigSix from "../../assets/branches/branchThree/branchThreeTwigSix.png";
import branchFourNoTwigs from "../../assets/branches/branchFour/branchFourNoTwigs.png";
import branchFourTwigOne from "../../assets/branches/branchFour/branchFourTwigOne.png";
import branchFourTwigTwo from "../../assets/branches/branchFour/branchFourTwigTwo.png";
import branchFourTwigThree from "../../assets/branches/branchFour/branchFourTwigThree.png";
import branchFourTwigFour from "../../assets/branches/branchFour/branchFourTwigFour.png";
import branchFourTwigFive from "../../assets/branches/branchFour/branchFourTwigFive.png";
import branchFourTwigSix from "../../assets/branches/branchFour/branchFourTwigSix.png";
import branchFiveNoTwigs from "../../assets/branches/branchFive/branchFiveNoTwigs.png";
import branchFiveTwigOne from "../../assets/branches/branchFive/branchFiveTwigOne.png";
import branchFiveTwigTwo from "../../assets/branches/branchFive/branchFiveTwigTwo.png";
import branchFiveTwigThree from "../../assets/branches/branchFive/branchFiveTwigThree.png";
import branchFiveTwigFour from "../../assets/branches/branchFive/branchFiveTwigFour.png";
import branchFiveTwigFive from "../../assets/branches/branchFive/branchFiveTwigFive.png";
import branchFiveTwigSix from "../../assets/branches/branchFive/branchFiveTwigSix.png";
import branchSixNoTwigs from "../../assets/branches/branchSix/branchSixNoTwigs.png";
import branchSixTwigOne from "../../assets/branches/branchSix/branchSixTwigOne.png";
import branchSixTwigTwo from "../../assets/branches/branchSix/branchSixTwigTwo.png";
import branchSixTwigThree from "../../assets/branches/branchSix/branchSixTwigThree.png";
import branchSixTwigFour from "../../assets/branches/branchSix/branchSixTwigFour.png";
import branchSixTwigFive from "../../assets/branches/branchSix/branchSixTwigFive.png";
import branchSixTwigSix from "../../assets/branches/branchSix/branchSixTwigSix.png";
import chevronGrey from "../../assets/chevronGrey.png";
import racoonImg from "../../assets/racoon.gif";
import MusicButton from "../modules/MusicButton";
import treeGrow from "../../assets/twigGrow.mp3";
import smallOneBranch from "../../assets/branches/smallScreen/smallOneBranch.png";
import smallTwoBranch from "../../assets/branches/smallScreen/smallTwoBranch.png";
import smallThreeBranch from "../../assets/branches/smallScreen/smallThreeBranch.png";
import smallFourBranch from "../../assets/branches/smallScreen/smallFourBranch.png";
import smallFiveBranch from "../../assets/branches/smallScreen/smallFiveBranch.png";
import smallSixBranch from "../../assets/branches/smallScreen/smallSixBranch.png";
import smallNoBranch from "../../assets/branches/smallScreen/smallNoBranch.png";
// component for displaying a single branch and its twigs
// goal is to have a branch component that can be used for both left and right side branches
const Branch = () => {
  const { branchId, userId } = useParams();
  const location = useLocation();
  const branchType = location.state?.branchType || 1;
  const [branch, setBranch] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");
  const navigate = useNavigate();
  const [currentTwigIndex, setCurrentTwigIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
      left: "30%",
    },
    {
      message:
        "Great! Now, click on the title of the branch you just created to zoom in and see your twigs",
      top: "62%",
      left: "33%",
    },
    {
      message:
        "Fantastic! Now, press the add twig button to add a twig to cover a more specific category of the general skill.",
      top: "40%",
      left: "27%",
    },
    {
      message:
        "Groovy! Now, now title and describe your twig. It should cover a more specific category of your branch's general skill area like options trading for finance, climate science research for research or MERN stack for website development.",
      top: "30%",
      left: "30%",
    },
    {
      message:
        "Awesome! Now press on the title of the twig you just created to zoom in and see your leaves.",
      top: "30%",
      left: "50%",
    },
    {
      message: "Awesome! Now add a leaf by pressing the add leaf button.",
      top: "40%",
      left: "30%",
    },
    {
      message:
        "Awesome! Now add a leaf with specific projects on that twig by pressing the add leaf button. For example, on an options trading twig I could put an algorithm I made, on a climate science research twig I could put an energy analysis project I completed, and for a MERN Stack twig I could put this amazing website that my team and I created!",
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

  // userId from either params or location state
  const currentUserId = userId || location.state?.userId;

  // image sets for different branch types
  const branchImageSets = {
    1: {
      regular: [
        branchOneNoTwigs,
        branchOneTwigOne,
        branchOneTwigTwo,
        branchOneTwigThree,
        branchOneTwigFour,
        branchOneTwigFive,
        branchOneTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
    2: {
      regular: [
        branchTwoNoTwigs,
        branchTwoTwigOne,
        branchTwoTwigTwo,
        branchTwoTwigThree,
        branchTwoTwigFour,
        branchTwoTwigFive,
        branchTwoTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
    3: {
      regular: [
        branchThreeNoTwigs,
        branchThreeTwigOne,
        branchThreeTwigTwo,
        branchThreeTwigThree,
        branchThreeTwigFour,
        branchThreeTwigFive,
        branchThreeTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
    4: {
      regular: [
        branchFourNoTwigs,
        branchFourTwigOne,
        branchFourTwigTwo,
        branchFourTwigThree,
        branchFourTwigFour,
        branchFourTwigFive,
        branchFourTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
    5: {
      regular: [
        branchFiveNoTwigs,
        branchFiveTwigOne,
        branchFiveTwigTwo,
        branchFiveTwigThree,
        branchFiveTwigFour,
        branchFiveTwigFive,
        branchFiveTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
    6: {
      regular: [
        branchSixNoTwigs,
        branchSixTwigOne,
        branchSixTwigTwo,
        branchSixTwigThree,
        branchSixTwigFour,
        branchSixTwigFive,
        branchSixTwigSix,
      ],
      small: [
        smallNoBranch,
        smallOneBranch,
        smallTwoBranch,
        smallThreeBranch,
        smallFourBranch,
        smallFiveBranch,
        smallSixBranch,
      ],
    },
  };

  // get the correct image set based on branch type
  const imageSet = branchImageSets[branchType] || branchImageSets[1];
  const twigImages = windowWidth <= 1300 ? imageSet.small : imageSet.regular;
  const [isTwigMode, setIsTwigMode] = useState(false);
  const [twigs, setTwigs] = useState([]);
  const [twigName, setTwigName] = useState("");
  const [twigDescription, setTwigDescription] = useState("");

  const tutorialActiveRef = useRef(location.state?.tutorialActive || false);

  const [tutorialActive, setTutorialActive] = useState(location.state?.tutorialActive || false);

  const [currentStep, setCurrentStep] = useState(location.state?.currentStep || 0);
  // function to determine if wooden sign should be on the left
  const isWoodenSignLeft = () => {
    return [2, 4, 6].includes(branchType);
  };

  // grab the branch info when we load the page
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        // get the api to get branch details
        const response = await fetch(`/api/branch/${branchId}`);
        if (response.ok) {
          const branchData = await response.json();
          // update all our state with the branch info
          setBranch(branchData);
          setBranchName(branchData.name);
          setBranchDescription(branchData.description);
          setTwigs(branchData.twigs || []); // empty array if no twigs yet
          // figure out which branch image to show based on number of twigs
          setCurrentTwigIndex(Math.min(branchData.twigs?.length || 0, twigImages.length - 1));
        } else {
          console.error("Failed to fetch branch data");
        }
      } catch (error) {
        console.error("Failed to fetch branch data:", error);
      }
    };

    // only try to fetch if we have a branch id
    if (branchId) {
      fetchBranch();
    }
  }, [branchId]);

  // handler for adding a new twig
  const handleAddTwig = () => {
    setCurrentStep(4);
    setIsEditMode(true);
    setTwigName("");
    setTwigDescription("");
    setIsTwigMode(true);
  };

  // handler for submitting branch or twig changes
  const handleSubmitBranch = async (title, description) => {
    try {
      playSound();
      if (isTwigMode) {
        const response = await fetch("/api/twig", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: title,
            description: description,
            branchId: branchId,
          }),
        });

        if (response.ok) {
          const newTwig = await response.json();
          setTwigs([...twigs, newTwig]);
          setCurrentTwigIndex(Math.min(twigs.length + 1, twigImages.length - 1));
        } else {
          console.error("Failed to create new twig");
        }
      } else {
        const response = await fetch(`/api/branch/${branchId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: title,
            description: description,
          }),
        });

        if (response.ok) {
          const updatedBranch = await response.json();
          setBranch(updatedBranch);
          setBranchName(updatedBranch.name);
          setBranchDescription(updatedBranch.description);
        } else {
          console.error("Failed to update branch");
        }
      }
      setIsEditMode(false);
      setIsTwigMode(false);
      setCurrentStep(5);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  // handler for deleting a branch
  const handleDeleteBranch = async () => {
    try {
      const response = await fetch(`/api/branch/${branchId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to delete branch");
      }
    } catch (error) {
      console.error("Failed to delete branch:", error);
    }
  };

  // handler for canceling the form
  const handleCancel = () => {
    setIsEditMode(false);
    setIsTwigMode(false);
    if (isTwigMode) {
      // Reset twig form
      setTwigName("");
      setTwigDescription("");
    } else {
      // Reset branch form
      setBranchName(branch?.name || "");
      setBranchDescription(branch?.description || "");
    }
  };

  // handler for hovering over a twig
  const handleTwigHover = (twig) => {
    if (!isEditMode) {
      setTwigName(twig.name);
      setTwigDescription(twig.description);
      setShowWoodenSign(true);
      setIsTwigMode(true);
    }
  };

  const handleTwigHoverEnd = () => {
    if (!isEditMode) {
      // if we are not hovering over a twig, show the branch info
      setTwigName("");
      setTwigDescription("");
      setShowWoodenSign(true);
      setIsTwigMode(false);

      setBranchName(branch?.name || "");
      setBranchDescription(branch?.description || "");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // render component
  return (
    <div className={`branch-type-${branchType}`}>
      <Navbar />
      {/* back button to return to tree view */}
      <div
        className="back-to-tree"
        onClick={() =>
          navigate(`/tree/${currentUserId}`, {
            state: { userId: currentUserId },
          })
        }
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div>
      {/* background image */}
      <img className="branch-background-image" src={twigImages[currentTwigIndex]} alt="Branch" />

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
            <img src={racoonImg} alt="Animal Guide" className="animal-image" />
            <div className="tutorial-message">{steps[currentStep].message}</div>
          </div>
        </div>
      )}
      {/* wooden sign for displaying/editing branch or twig info */}
      {showWoodenSign && (
        <div className={`wooden-sign-container ${isWoodenSignLeft() ? "left-sign" : "right-sign"}`}>
          <WoodenSign
            title={isTwigMode ? twigName : branchName}
            description={isTwigMode ? twigDescription : branchDescription}
            onSubmit={handleSubmitBranch}
            onDelete={handleDeleteBranch}
            onCancel={handleCancel}
            onAddTwig={handleAddTwig}
            readOnly={!isEditMode && isTwigMode}
            initialEditMode={isEditMode}
            mode={isTwigMode ? "twig" : "branch"}
            disabled={twigs.length >= 6}
          />
        </div>
      )}
      {/* Hidden audio element for sound effect */}
      <audio ref={soundRef}>
        <source src={treeGrow} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* twig hitboxes */}
      {twigs.slice(0, 6).map((twig, index) => (
        <div
          key={index}
          className={`twig-hitbox twig-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          style={{
            // during the tutorial, the hitbox should be above the navbar
            zIndex: tutorialActive ? 1001 : 504,
          }}
          onMouseEnter={() => handleTwigHover(twig)}
          onMouseLeave={handleTwigHoverEnd}
          onClick={() =>
            navigate(`/tree/${currentUserId}/branch/${branchId}/twig/${twig._id}`, {
              state: {
                twigType: isWoodenSignLeft() ? 2 : 1,
                branchId: branchId,
                userId: currentUserId,
                branchType: branchType,
                tutorialActive: tutorialActiveRef.current,
                currentStep: 6,
              },
            })
          }
        >
          {twig.name}
        </div>
      ))}
    </div>
  );
};

export default Branch;
