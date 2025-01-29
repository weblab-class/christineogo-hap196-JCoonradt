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
  const [endorsements, setEndorsements] = useState([]);
  const [isEndorsed, setIsEndorsed] = useState(false);

  // userId from either params or location state
  const currentUserId = userId || location.state?.userId;

  // image sets for different branch types
  const branchImageSets = {
    1: [
      branchOneNoTwigs,
      branchOneTwigOne,
      branchOneTwigTwo,
      branchOneTwigThree,
      branchOneTwigFour,
      branchOneTwigFive,
      branchOneTwigSix,
    ],
    2: [
      branchTwoNoTwigs,
      branchTwoTwigOne,
      branchTwoTwigTwo,
      branchTwoTwigThree,
      branchTwoTwigFour,
      branchTwoTwigFive,
      branchTwoTwigSix,
    ],
    3: [
      branchThreeNoTwigs,
      branchThreeTwigOne,
      branchThreeTwigTwo,
      branchThreeTwigThree,
      branchThreeTwigFour,
      branchThreeTwigFive,
      branchThreeTwigSix,
    ],
    4: [
      branchFourNoTwigs,
      branchFourTwigOne,
      branchFourTwigTwo,
      branchFourTwigThree,
      branchFourTwigFour,
      branchFourTwigFive,
      branchFourTwigSix,
    ],
    5: [
      branchFiveNoTwigs,
      branchFiveTwigOne,
      branchFiveTwigTwo,
      branchFiveTwigThree,
      branchFiveTwigFour,
      branchFiveTwigFive,
      branchFiveTwigSix,
    ],
    6: [
      branchSixNoTwigs,
      branchSixTwigOne,
      branchSixTwigTwo,
      branchSixTwigThree,
      branchSixTwigFour,
      branchSixTwigFive,
      branchSixTwigSix,
    ],
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
        // Use the get utility function instead of fetch
        const [branchData, userData] = await Promise.all([
          get("/api/branch/" + branchId),
          !location.state?.friendName ? get("/api/user/" + currentUserId) : Promise.resolve(null),
        ]);

        if (branchData) {
          setBranch(branchData);
          setBranchName(branchData.name);
          setBranchDescription(branchData.description);
          const twigs = branchData.twigs || [];
          setTwigs(twigs);
          setCurrentTwigIndex(Math.min(twigs.length, twigImages.length - 1));
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
  }, [branchId, currentUserId, location.state?.friendName, branchType, twigImages.length]);

  // Check if current user has endorsed this branch
  useEffect(() => {
    if (branch?.endorsements) {
      setEndorsements(branch.endorsements);
      setIsEndorsed(branch.endorsements.some((e) => e.userId === currentUserId));
    }
  }, [branch, currentUserId]);

  const handleEndorse = async () => {
    try {
      const response = await fetch(`/api/branch/${branchId}/endorse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setEndorsements(data.endorsements);
        setIsEndorsed(data.endorsed);
      }
    } catch (error) {
      console.error("Failed to endorse branch:", error);
    }
  };

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
        twigType: isWoodenSignLeft() ? 2 : 1,
        branchId: branchId,
        branchType: branchType,
        friendName: friendName,
      },
    });
  };

  return (
    <div className={`branch-type-${branchType}`}>
      <Navbar />
      <div
        className="back-to-tree"
        onClick={() =>
          navigate(`/friend/${currentUserId}/tree`, {
            state: { friendName: friendName },
          })
        }
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div>

      {/* Endorsement Section */}
      <div className="endorsement-section">
        <button
          className={`endorse-button ${isEndorsed ? "endorsed" : ""}`}
          onClick={handleEndorse}
        >
          {isEndorsed ? "Endorsed!" : "Endorse"}
        </button>
        {endorsements.length > 0 && (
          <div className="endorsements-list">
            <h3>Endorsed by:</h3>
            <div className="endorsers">
              {endorsements.map((endorsement, index) => (
                <span key={endorsement.userId} className="endorser-name">
                  {endorsement.name}
                  {index < endorsements.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* background image */}
      <img
        className="branch-background-image"
        src={twigImages[currentTwigIndex]}
        alt={`Branch type ${branchType} with ${currentTwigIndex} twigs`}
      />

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

      <MusicButton />

      {/* twig hitboxes */}
      {twigs.slice(0, 6).map((twig, index) => (
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

      <div className="friend-name-label">{friendName}'s Tree</div>
    </div>
  );
};

export default FriendBranch;
