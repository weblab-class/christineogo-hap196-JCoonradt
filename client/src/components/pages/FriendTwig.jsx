import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { get } from "../../utilities";
import "./Twig.css";
import Navbar from "../modules/Navbar";
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

const FriendTwig = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, branchId, twigId } = useParams();
  const twigType = location.state?.twigType || 1;
  const originalBranchType = location.state?.branchType;
  const [twig, setTwig] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [twigName, setTwigName] = useState("");
  const [twigDescription, setTwigDescription] = useState("");
  const [currentLeafIndex, setCurrentLeafIndex] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [leafName, setLeafName] = useState("");
  const [leafDescription, setLeafDescription] = useState("");
  const [leafLink, setLeafLink] = useState("");
  const [friendName, setFriendName] = useState(location.state?.friendName || "");
  const [branchType, setBranchType] = useState(location.state?.branchType || 1);

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

  const leafImages = twigImageSets[twigType] || twigImageSets[1];

  // helper function to determine if wooden sign should be on the left
  const isWoodenSignLeft = () => {
    return twigType === 2;
  };

  // get twig data when component mounts
  useEffect(() => {
    const fetchTwigAndUser = async () => {
      try {
        const [twigResponse, userResponse] = await Promise.all([
          get(`/api/twig/${twigId}`), // Changed to use path parameter instead of query
          !location.state?.friendName ? get("/api/user", { userId: userId }) : Promise.resolve(null)
        ]);

        if (twigResponse.twig) {
          setTwig(twigResponse.twig);
          setTwigName(twigResponse.twig.name);
          setTwigDescription(twigResponse.twig.description);
          setLeaves(twigResponse.twig.leaves || []);
          setCurrentLeafIndex(Math.min(twigResponse.twig.leaves?.length || 0, leafImages.length - 1));
        }

        if (!location.state?.friendName && userResponse?.user) {
          setFriendName(userResponse.user.name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (twigId) {
      fetchTwigAndUser();
    }
  }, [twigId, userId, location.state?.friendName]);

  // handlers for leaf hover events
  const handleLeafHover = (leaf) => {
    setLeafName(leaf.name);
    setLeafDescription(leaf.description);
    setLeafLink(leaf.link);
    setShowWoodenSign(true);
  };

  // handler for leaf click
  const handleLeafClick = (leaf) => {
    if (leaf.link) {
      window.open(leaf.link, "_blank");
    }
  };

  return (
    <div className="twig-container" style={{ backgroundColor: '#7bbfff' }}>
      <Navbar />
      <div className="wooden-sign-container" style={{ position: 'fixed', left: '10px', top: '0%', zIndex: 501 }}>
        <WoodenSign
          title={twigName}
          description={leafDescription || twigDescription}
          readOnly={true}
          isLeft={isWoodenSignLeft()}
        />
      </div>
      <div
        className="back-to-tree"
        onClick={() =>
          navigate(`/friend/${userId}/tree`, {
            state: { friendName: friendName, userId: userId },
          })
        }
        style={{ position: 'fixed', bottom: '80px', right: '130px', zIndex: 1000 }}
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div>
      <div
        className="back-to-branch"
        onClick={() =>
          navigate(`/friend/${userId}/tree/branch/${location.state?.branchId}`, {
            state: {
              branchType: branchType,
              friendName: friendName,
              userId: userId,
              currentUserId: userId,
              branchId: location.state?.branchId
            },
          })
        }
        style={{ position: 'fixed', bottom: '140px', right: '130px', zIndex: 1000 }}
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Branch</span>
      </div>
      <img
        className="twig-image"
        src={leafImages[currentLeafIndex]}
        alt={`Twig with ${currentLeafIndex} leaves`}
      />
      {leaves.map((leaf, index) => (
        <div
          key={index}
          className={`leaf-hitbox leaf-hitbox-${index + 1}`}
          onMouseEnter={() => handleLeafHover(leaf)}
          onMouseLeave={() => {
            setShowWoodenSign(true);
            setLeafName("");
            setLeafDescription("");
            setLeafLink("");
          }}
          onClick={() => handleLeafClick(leaf)}
        />
      ))}
      <img
        className="back-button"
        src={chevronGrey}
        alt="Back"
        onClick={() =>
          navigate(`/friend/${userId}/tree/branch/${branchId}`, {
            state: {
              userId: userId,
              branchType: originalBranchType,
            },
          })
        }
      />
      <div className="friend-name-label">
        {friendName}'s Tree
      </div>
    </div>
  );
};

export default FriendTwig;
