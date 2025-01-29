import { React, useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Twig.css";
import WoodenSign from "../modules/WoodenSign";
import chevronGrey from "../../assets/chevronGrey.png";

import leftTwigNoLeaf from "../../assets/twigs/left/leftTwigNoLeaf.png";
import leftTwigOneLeaf from "../../assets/twigs/left/leftTwigOneLeaf.png";
import leftTwigTwoLeaf from "../../assets/twigs/left/leftTwigTwoLeaf.png";
import leftTwigThreeLeaf from "../../assets/twigs/left/leftTwigThreeLeaf.png";
import leftTwigFourLeaf from "../../assets/twigs/left/leftTwigFourLeaf.png";
import leftTwigFiveLeaf from "../../assets/twigs/left/leftTwigFiveLeaf.png";
import leftTwigSixLeaf from "../../assets/twigs/left/leftTwigSixLeaf.png";

import rightTwigNoLeaf from "../../assets/twigs/right/rightTwigNoLeaf.png";
import rightTwigOneLeaf from "../../assets/twigs/right/rightTwigOneLeaf.png";
import rightTwigTwoLeaf from "../../assets/twigs/right/rightTwigTwoLeaf.png";
import rightTwigThreeLeaf from "../../assets/twigs/right/rightTwigThreeLeaf.png";
import rightTwigFourLeaf from "../../assets/twigs/right/rightTwigFourLeaf.png";
import rightTwigFiveLeaf from "../../assets/twigs/right/rightTwigFiveLeaf.png";
import rightTwigSixLeaf from "../../assets/twigs/right/rightTwigSixLeaf.png";
import MusicButton from "../modules/MusicButton";
import racoonImg from "../../assets/racoon.gif";

import treeGrow from "../../assets/LeafRustle.mp3";

const Twig = () => {
  const { twigId } = useParams();
  const location = useLocation();
  const twigType = location.state?.twigType || 1;
  const branchId = location.state?.branchId;
  const originalBranchType = location.state?.branchType;
  const navigate = useNavigate();

  const [twig, setTwig] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [twigName, setTwigName] = useState("");
  const [twigDescription, setTwigDescription] = useState("");
  const [currentLeafIndex, setCurrentLeafIndex] = useState(0);
  const [isLeafMode, setIsLeafMode] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [leafName, setLeafName] = useState("");
  const [leafDescription, setLeafDescription] = useState("");
  const [leafLink, setLeafLink] = useState("");

  const tutorialActiveRef = useState(location.state?.tutorialActive || false);

  const [tutorialActive, setTutorialActive] = useState(location.state?.tutorialActive || false);
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setTutorialActive(false); // End tutorial
    }
  };
  console.log("Tutorial Active:" + tutorialActive);
  const [currentStep, setCurrentStep] = useState(location.state?.currentStep || 0);
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
      top: "50%",
      left: "40%",
    },
    {
      message:
        "Groovy! Now, now title and describe your twig. It should cover a more specific category of your branch's general skill area like options trading for finance, climate science research for research or MERN stack for website development.",
      top: "30%",
      left: "40%",
    },
    {
      message:
        "Awesome! Now press on the title of the twig you just created to zoom in and see your leaves.",
      top: "30%",
      left: "60%",
    },
    {
      message:
        "Awesome! Now add a leaf by pressing the add leaf button. Leafs are meant to represent specific projects within the twig. ",
      top: "50%",
      left: "30%",
    },
    {
      message:
        "Fantastic! Now title and describe your leaf. Add a link or file to your project leaf too if relevant. For example, on an options trading twig I could put an algorithm I made, on a climate science research twig I could put an energy analysis project I completed, and for a MERN Stack twig I could put this amazing website we created!",
      top: "50%",
      left: "30%",
    },
    {
      message:
        "You can always use the navigation bar up here to select forest and visit your friends' trees or stats to see metrics on your growth. You're all set! Hit finish to end the tutorial and have fun exploring.",
      top: "35%",
      left: "50%",
    },
  ];

  // Image sets for different twig types (left and right side)
  const twigImageSets = {
    1: [
      leftTwigNoLeaf,
      leftTwigOneLeaf,
      leftTwigTwoLeaf,
      leftTwigThreeLeaf,
      leftTwigFourLeaf,
      leftTwigFiveLeaf,
      leftTwigSixLeaf,
    ],
    2: [
      rightTwigNoLeaf,
      rightTwigOneLeaf,
      rightTwigTwoLeaf,
      rightTwigThreeLeaf,
      rightTwigFourLeaf,
      rightTwigFiveLeaf,
      rightTwigSixLeaf,
    ],
  };

  const soundRef = useRef(null);
  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.currentTime = 0; // Reset the sound to the beginning
      soundRef.current.play();
    }
  };

  const leafImages = twigImageSets[twigType] || twigImageSets[1];

  // helper function to determine if wooden sign should be on the left
  const isWoodenSignLeft = () => {
    return twigType === 2;
  };

  // get twig data when component mounts
  useEffect(() => {
    const fetchTwig = async () => {
      try {
        const response = await fetch(`/api/twig/${twigId}`);
        if (response.ok) {
          const twigData = await response.json();
          setTwig(twigData);
          setTwigName(twigData.name);
          setTwigDescription(twigData.description);
          setLeaves(twigData.leaves || []);
          setCurrentLeafIndex(Math.min(twigData.leaves?.length || 0, leafImages.length - 1));
        } else {
          console.error("Failed to fetch twig data");
        }
      } catch (error) {
        console.error("Failed to fetch twig data:", error);
      }
    };

    if (twigId) {
      fetchTwig();
    }
  }, [twigId]);

  // handler for adding a new leaf
  const handleAddLeaf = () => {
    setIsEditMode(true);
    setLeafName("");
    setLeafDescription("");
    setLeafLink("");
    setIsLeafMode(true);
    setShowWoodenSign(true);
    setCurrentStep(7);
  };

  // handlers for leaf hover events
  const handleLeafHover = (leaf) => {
    if (!isEditMode) {
      setLeafName(leaf.name);
      setLeafDescription(leaf.description);
      setLeafLink(leaf.link);
      setShowWoodenSign(true);
      setIsLeafMode(true);
    }
  };

  const handleLeafHoverEnd = () => {
    if (!isEditMode) {
      setLeafName("");
      setLeafDescription("");
      setLeafLink("");
      setShowWoodenSign(true);
      setIsLeafMode(false);
    }
  };

  // handler for submitting twig or leaf changes
  const handleSubmit = async (title, description, mode, link) => {
    try {
      setCurrentStep(8);
      playSound();
      if (mode === "leaf") {
        const response = await fetch("/api/leaf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: title,
            description: description,
            link: link,
            twigId: twigId,
          }),
        });

        if (response.ok) {
          const newLeaf = await response.json();
          const updatedLeaves = [...leaves, newLeaf];
          setLeaves(updatedLeaves);
          setCurrentLeafIndex(Math.min(updatedLeaves.length, leafImages.length - 1));
          setIsEditMode(false);
          setIsLeafMode(false);
          setShowWoodenSign(true);
          setLeafName(newLeaf.name);
          setLeafDescription(newLeaf.description);
          setLeafLink(newLeaf.link || "");
          setLeafLink(newLeaf.link);
        }
      } else {
        const response = await fetch(`/api/twig/${twigId}`, {
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
          const updatedTwig = await response.json();
          setTwig(updatedTwig);
          setTwigName(updatedTwig.name);
          setTwigDescription(updatedTwig.description);
        }
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  // handler for deleting a twig
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/twig/${twigId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        navigate(`/tree/${location.state?.userId}/branch/${branchId}`, {
          state: {
            userId: location.state?.userId,
            branchType: originalBranchType,
          },
        });
      }
    } catch (error) {
      console.error("Failed to delete twig:", error);
    }
  };

  // handler for canceling the form
  const handleCancel = () => {
    setIsEditMode(false);
    setIsLeafMode(false);
    if (isLeafMode) {
      setLeafName("");
      setLeafDescription("");
      setLeafLink("");
    } else {
      setTwigName(twig?.name || "");
      setTwigDescription(twig?.description || "");
    }
  };

  // log this so we know that we're going back to the correct branch
  console.log("original branch type:", originalBranchType);

  return (
    <div className={`twig-type-${twigType}`}>
      <Navbar />
      <div
        className="back-to-branch"
        onClick={() =>
          navigate(`/tree/${location.state?.userId}/branch/${branchId}`, {
            state: {
              userId: location.state?.userId,
              branchType: originalBranchType,
            },
          })
        }
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Branch</span>
      </div>
      {/* wooden sign*/}
      {showWoodenSign && (
        <div className={`wooden-sign-container ${isWoodenSignLeft() ? "left-sign" : "right-sign"}`}>
          <WoodenSign
            title={isLeafMode ? leafName : twigName}
            description={isLeafMode ? leafDescription : twigDescription}
            link={isLeafMode ? leafLink : null}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onAddLeaf={handleAddLeaf}
            readOnly={!isEditMode && isLeafMode}
            initialEditMode={isEditMode}
            mode={isLeafMode ? "leaf" : "twig"}
            showAddLeaf={!isLeafMode && !isEditMode}
            disabled={leaves.length >= 6}
          />
        </div>
      )}
      {/* twig image */}
      <img className="twig-image" src={leafImages[currentLeafIndex]} alt="Twig" />

      {/* leaf hitboxes */}
      {leaves.slice(0, 6).map((leaf, index) => (
        <div
          key={index}
          className={`leaf-hitbox leaf-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          style={{
            // during the tutorial, the hitbox should be above the navbar
            zIndex: tutorialActive ? 1001 : 504,
          }}
          onMouseEnter={() => handleLeafHover(leaf)}
          onMouseLeave={handleLeafHoverEnd}
          onClick={() =>
            navigate(
              `/tree/${location.state?.userId}/branch/${branchId}/twig/${twigId}/leaf/${leaf._id}`,
              {
                state: {
                  twigId: twigId,
                  branchId: branchId,
                  userId: location.state?.userId,
                  twigType: twigType,
                },
              }
            )
          }
        >
          {leaf.name}
        </div>
      ))}
      <MusicButton />
      {/* Hidden audio element for sound effect */}
      <audio ref={soundRef}>
        <source src={treeGrow} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

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

            {/* Conditional rendering for step 8 */}
            {currentStep === 8 && (
              <div>
                <button className="tutorial-next" onClick={handleNext}>
                  {currentStep < steps.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Twig;
