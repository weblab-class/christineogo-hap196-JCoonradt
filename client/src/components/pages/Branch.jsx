import { React, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Branch.css";
import WoodenSign from "../modules/WoodenSign";

import branchOneNoTwigs from "../../assets/branches/branchOne/branchOneNoTwigs.png";
import branchOneTwigOne from "../../assets/branches/branchOne/branchOneTwigOne.png";
import branchOneTwigTwo from "../../assets/branches/branchOne/branchOneTwigTwo.png";
import branchOneTwigThree from "../../assets/branches/branchOne/branchOneTwigThree.png";
import branchTwoNoTwigs from "../../assets/branches/branchTwo/branchTwoNoTwigs.png";
import branchTwoTwigOne from "../../assets/branches/branchTwo/branchTwoTwigOne.png";
import branchTwoTwigTwo from "../../assets/branches/branchTwo/branchTwoTwigTwo.png";
import branchTwoTwigThree from "../../assets/branches/branchTwo/branchTwoTwigThree.png";
import branchThreeNoTwigs from "../../assets/branches/branchThree/branchThreeNoTwigs.png";
import branchThreeTwigOne from "../../assets/branches/branchThree/branchThreeTwigOne.png";
import branchThreeTwigTwo from "../../assets/branches/branchThree/branchThreeTwigTwo.png";
import branchThreeTwigThree from "../../assets/branches/branchThree/branchThreeTwigThree.png";
import branchFourNoTwigs from "../../assets/branches/branchFour/branchFourNoTwigs.png";
import branchFourTwigOne from "../../assets/branches/branchFour/branchFourTwigOne.png";
import branchFourTwigTwo from "../../assets/branches/branchFour/branchFourTwigTwo.png";
import branchFourTwigThree from "../../assets/branches/branchFour/branchFourTwigThree.png";
import branchFiveNoTwigs from "../../assets/branches/branchFive/branchFiveNoTwigs.png";
import branchFiveTwigOne from "../../assets/branches/branchFive/branchFiveTwigOne.png";
import branchFiveTwigTwo from "../../assets/branches/branchFive/branchFiveTwigTwo.png";
import branchFiveTwigThree from "../../assets/branches/branchFive/branchFiveTwigThree.png";
import branchSixNoTwigs from "../../assets/branches/branchSix/branchSixNoTwigs.png";
import branchSixTwigOne from "../../assets/branches/branchSix/branchSixTwigOne.png";
import branchSixTwigTwo from "../../assets/branches/branchSix/branchSixTwigTwo.png";
import branchSixTwigThree from "../../assets/branches/branchSix/branchSixTwigThree.png";
import chevronGrey from "../../assets/chevronGrey.png";
import branchBackground from "../../assets/branchBackground.png";

// component for displaying a single branch and its twigs
// goal is to have a branch component that can be used for both left and right side branches
const Branch = () => {
  const { branchId, userId } = useParams();
  const location = useLocation();
  // default to 1 if not specified
  const branchType = location.state?.branchType || 1;
  const [branch, setBranch] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");
  const navigate = useNavigate();
  const [currentTwigIndex, setCurrentTwigIndex] = useState(0);

  // userId from either params or location state
  const currentUserId = userId || location.state?.userId;

  // image sets for different branch types
  const branchImageSets = {
    1: [branchOneNoTwigs, branchOneTwigOne, branchOneTwigTwo, branchOneTwigThree],
    2: [branchTwoNoTwigs, branchTwoTwigOne, branchTwoTwigTwo, branchTwoTwigThree],
    3: [branchThreeNoTwigs, branchThreeTwigOne, branchThreeTwigTwo, branchThreeTwigThree],
    4: [branchFourNoTwigs, branchFourTwigOne, branchFourTwigTwo, branchFourTwigThree],
    5: [branchFiveNoTwigs, branchFiveTwigOne, branchFiveTwigTwo, branchFiveTwigThree],
    6: [branchSixNoTwigs, branchSixTwigOne, branchSixTwigTwo, branchSixTwigThree],
  };

  // get the correct image set based on branch type
  const twigImages = branchImageSets[branchType] || branchImageSets[1];
  const [isTwigMode, setIsTwigMode] = useState(false);
  const [twigs, setTwigs] = useState([]);
  const [twigName, setTwigName] = useState("");
  const [twigDescription, setTwigDescription] = useState("");

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
    setIsEditMode(true);
    setTwigName("");
    setTwigDescription("");
    setIsTwigMode(true);
  };

  // handler for submitting branch or twig changes
  const handleSubmitBranch = async (title, description) => {
    try {
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
      <img src={branchBackground} alt="Branch Background" className="branch-background-image" />
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
          />
        </div>
      )}
      {/* branch image showing current number of twigs */}
      <img className="branch-image" src={twigImages[currentTwigIndex]} alt="Branch" />

      {/* twig hitboxes */}
      {twigs.slice(0, 3).map((twig, index) => (
        <div
          key={index}
          className={`twig-hitbox twig-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          onMouseEnter={() => handleTwigHover(twig)}
          onMouseLeave={handleTwigHoverEnd}
          onClick={() =>
            navigate(`/tree/${currentUserId}/branch/${branchId}/twig/${twig._id}`, {
              state: {
                twigType: isWoodenSignLeft() ? 2 : 1,
                branchId: branchId,
                userId: currentUserId,
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
