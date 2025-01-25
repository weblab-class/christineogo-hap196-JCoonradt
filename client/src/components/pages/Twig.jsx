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
  };

  // handler for submitting twig or leaf changes
  const handleSubmit = async (title, description, mode) => {
    try {
      if (isLeafMode) {
        const response = await fetch("/api/leaf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: title,
            description: description,
            link: leafLink,
            twigId: twigId,
          }),
        });

        if (response.ok) {
          const newLeaf = await response.json();
          setLeaves([...leaves, newLeaf]);
          setCurrentLeafIndex(Math.min(leaves.length + 1, leafImages.length - 1));
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
      setIsEditMode(false);
      setIsLeafMode(false);
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
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onAddLeaf={handleAddLeaf}
            readOnly={!isEditMode && isLeafMode}
            initialEditMode={isEditMode}
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
          className={`leaf-hitbox leaf-hitbox-${index} ${isEditMode ? "edit-mode" : ""}`}
          onMouseEnter={() => handleLeafHover(leaf)}
          onMouseLeave={handleLeafHoverEnd}
        >
          {leaf.name}
        </div>
      ))}
    </div>
  );
};

export default Twig;
