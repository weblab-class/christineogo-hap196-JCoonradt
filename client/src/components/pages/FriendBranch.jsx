import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { get } from "../../utilities";
import Navbar from "../modules/Navbar";
import "./Branch.css";
import WoodenSign from "../modules/WoodenSign";
import MusicButton from "../modules/MusicButton";

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

// component for displaying a friend's branch and its twigs (read-only)
const FriendBranch = () => {
  const { branchId: paramBranchId, userId } = useParams();
  const location = useLocation();
  const branchType = location.state?.branchType || 1;
  const branchId = paramBranchId || location.state?.branchId;
  const [branch, setBranch] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");
  const navigate = useNavigate();
  const [currentTwigIndex, setCurrentTwigIndex] = useState(0);
  const [friendName, setFriendName] = useState(location.state?.friendName || "");
  const [twigs, setTwigs] = useState([]);

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

  // function to determine if wooden sign should be on the left
  const isWoodenSignLeft = () => {
    return [2, 4, 6].includes(branchType);
  };

  // grab the branch info when we load the page
  useEffect(() => {
    const fetchBranchAndUser = async () => {
      try {
        console.log("Fetching branch with ID:", branchId, "and branch type:", branchType);

        // Use the get utility function instead of fetch
        const [branchData, userData] = await Promise.all([
          get("/api/branch/" + branchId),
          !location.state?.friendName ? get("/api/user/" + currentUserId) : Promise.resolve(null),
        ]);

        console.log("Received branch data:", branchData);

        if (branchData) {
          setBranch(branchData);
          setBranchName(branchData.name);
          setBranchDescription(branchData.description);
          const twigs = branchData.twigs || [];
          setTwigs(twigs);
          setCurrentTwigIndex(Math.min(twigs.length, 3)); // Max 3 twigs per branch
        } else {
          console.error("No branch data received");
        }

        if (!location.state?.friendName && userData) {
          setFriendName(userData.name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Set some error state here if needed
      }
    };

    if (branchId && currentUserId) {
      fetchBranchAndUser();
    }
  }, [branchId, currentUserId, location.state?.friendName, branchType]);

  // handler for hovering over a twig
  const handleTwigHover = (twig) => {
    setBranchName(twig.name);
    setBranchDescription(twig.description);
    setShowWoodenSign(true);
  };

  const handleTwigHoverEnd = () => {
    setBranchName(branch?.name || "");
    setBranchDescription(branch?.description || "");
    setShowWoodenSign(true);
  };

  // handler for clicking on a twig
  const handleTwigClick = (twigId, index) => {
    navigate(`/friend/${currentUserId}/tree/branch/${branchId}/twig/${twigId}`, {
      state: {
        userId: currentUserId,
        twigType: index % 2 === 0 ? 1 : 2,
        branchId: branchId,
        branchType: branchType,
        friendName: friendName,
      },
    });
  };

  return (
    <div className={`branch-type-${branchType}`}>
      <Navbar />
      {/* back button to return to tree view */}
      <div
        className="back-to-tree"
        onClick={() =>
          navigate(`/friend/${userId}/tree`, {
            state: { friendName: friendName, userId: userId },
          })
        }
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div>
      {/* background image */}
      <img src={branchBackground} alt="Branch Background" className="branch-background-image" />

      {/* wooden sign for displaying branch or twig info */}
      {showWoodenSign && (
        <div className={`wooden-sign-container ${isWoodenSignLeft() ? "left-sign" : "right-sign"}`}>
          <WoodenSign
            title={branchName}
            description={branchDescription}
            readOnly={true}
            isLeft={isWoodenSignLeft()}
          />
        </div>
      )}

      {/* branch image showing current number of twigs */}
      <img 
        className="branch-image" 
        src={twigImages[currentTwigIndex]} 
        alt={`Branch type ${branchType} with ${currentTwigIndex} twigs`}
      />

      <MusicButton />

      {/* twig hitboxes */}
      {twigs.slice(0, 3).map((twig, index) => (
        <div
          key={index}
          className={`twig-hitbox twig-hitbox-${index}`}
          onMouseEnter={() => handleTwigHover(twig)}
          onMouseLeave={handleTwigHoverEnd}
          onClick={() => handleTwigClick(twig._id, index)}
        >
          {twig.name}
        </div>
      ))}

      <div className="friend-name-label">
        {friendName}'s Tree
      </div>
    </div>
  );
};

export default FriendBranch;
