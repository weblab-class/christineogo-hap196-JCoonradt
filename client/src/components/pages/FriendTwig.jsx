import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { get } from "../../utilities";
import "./Twig.css";
import Navbar from "../modules/Navbar";
import WoodenSign from "../modules/WoodenSign";
import chevronGrey from "../../assets/chevronGrey.png";
import MusicButton from "../modules/MusicButton";

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
  const [isLeafMode, setIsLeafMode] = useState(false);

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
          get(`/api/twig/${twigId}`),
          !location.state?.friendName
            ? get("/api/user", { userId: userId })
            : Promise.resolve(null),
        ]);

        if (twigResponse) {
          setTwig(twigResponse);
          setTwigName(twigResponse.name);
          setTwigDescription(twigResponse.description);
          setLeaves(twigResponse.leaves || []);
          setCurrentLeafIndex(Math.min(twigResponse.leaves?.length || 0, leafImages.length - 1));
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
    setIsLeafMode(true);
  };

  const handleLeafHoverEnd = () => {
    setShowWoodenSign(true);
    setLeafName("");
    setLeafDescription("");
    setLeafLink("");
    setIsLeafMode(false);
  };

  return (
    <div className={`twig-type-${twigType}`}>
      <Navbar />
      <div
        className="back-to-branch"
        onClick={() =>
          navigate(`/friend/${userId}/tree/branch/${branchId}`, {
            state: {
              userId: userId,
              branchType: originalBranchType,
              friendName: friendName,
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
            readOnly={true}
            mode={isLeafMode ? "leaf" : "twig"}
          />
        </div>
      )}
      {/* twig image */}
      <img className="twig-image" src={leafImages[currentLeafIndex]} alt="Twig" />

      {/* leaf hitboxes */}
      {leaves.slice(0, 6).map((leaf, index) => (
        <div
          key={index}
          className={`leaf-hitbox leaf-hitbox-${index}`}
          onMouseEnter={() => handleLeafHover(leaf)}
          onMouseLeave={handleLeafHoverEnd}
          onClick={() =>
            navigate(`/friend/${userId}/tree/branch/${branchId}/twig/${twigId}/leaf/${leaf._id}`, {
              state: {
                twigId: twigId,
                branchId: branchId,
                userId: userId,
                twigType: twigType,
                friendName: friendName,
              },
            })
          }
        >
          {leaf.name}
        </div>
      ))}
      {/* <div
        className="back-to-tree"
        onClick={() =>
          navigate(`/friend/${userId}/tree`, {
            state: { friendName: friendName, userId: userId },
          })
        }
        style={{ position: "fixed", bottom: "80px", right: "130px", zIndex: 1000 }}
      >
        <img src={chevronGrey} alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div> */}
      <div className="friend-name-label">{friendName}'s Tree</div>
    </div>
  );
};

export default FriendTwig;
