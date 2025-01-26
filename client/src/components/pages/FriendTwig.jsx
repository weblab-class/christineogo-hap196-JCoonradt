import { React, useState, useEffect } from "react";
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

const FriendTwig = () => {
  const { twigId } = useParams();
  const location = useLocation();
  const twigType = location.state?.twigType || 1;
  const branchId = location.state?.branchId;
  const originalBranchType = location.state?.branchType;
  const navigate = useNavigate();

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
          fetch(`/api/twig/${twigId}`),
          !location.state?.friendName ? fetch(`/api/user/${location.state?.userId}`) : Promise.resolve(null)
        ]);

        if (twigResponse.ok) {
          const twigData = await twigResponse.json();
          setTwig(twigData);
          setTwigName(twigData.name);
          setTwigDescription(twigData.description);
          setLeaves(twigData.leaves || []);
          setCurrentLeafIndex(Math.min(twigData.leaves?.length || 0, leafImages.length - 1));
        }

        if (!location.state?.friendName && userResponse) {
          const userData = await userResponse.json();
          setFriendName(userData.name);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (twigId && location.state?.userId) {
      fetchTwigAndUser();
    }
  }, [twigId, location.state?.userId, location.state?.friendName]);

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
    <div>
      <Navbar />
      <div className="wooden-sign-container">
        {showWoodenSign && (
          <WoodenSign
            title={leafName || twigName}
            description={leafDescription || twigDescription}
            readOnly={true}
            isLeft={isWoodenSignLeft()}
          />
        )}
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
          navigate(`/friend/${location.state?.userId}/tree/branch/${branchId}`, {
            state: {
              userId: location.state?.userId,
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
