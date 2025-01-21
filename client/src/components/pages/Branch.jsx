import { React, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Branch.css";
import WoodenSign from "../modules/WoodenSign";

// component for displaying a single branch and its twigs
// goal is to have a branch component that can be used for both left and right side branches
const Branch = () => {
  const { branchId } = useParams();
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

  // image sets for different branch types
  const branchImageSets = {
    1: [
      "/branchOne/branchOneNoTwigs.png",
      "/branchOne/branchOneTwigOne.png",
      "/branchOne/branchOneTwigTwo.png",
      "/branchOne/branchOneTwigThree.png",
    ],
    2: [
      "/branchTwo/branchTwoNoTwigs.png",
      "/branchTwo/branchTwoTwigOne.png",
      "/branchTwo/branchTwoTwigTwo.png",
      "/branchTwo/branchTwoTwigThree.png",
    ],
    3: [
      "/branchThree/branchThreeNoTwigs.png",
      "/branchThree/branchThreeTwigOne.png",
      "/branchThree/branchThreeTwigTwo.png",
      "/branchThree/branchThreeTwigThree.png",
    ],
    4: [
      "/branchFour/branchFourNoTwigs.png",
      "/branchFour/branchFourTwigOne.png",
      "/branchFour/branchFourTwigTwo.png",
      "/branchFour/branchFourTwigThree.png",
    ],
    5: [
      "/branchFive/branchFiveNoTwigs.png",
      "/branchFive/branchFiveTwigOne.png",
      "/branchFive/branchFiveTwigTwo.png",
      "/branchFive/branchFiveTwigThree.png",
    ],
    6: [
      "/branchSix/branchSixNoTwigs.png",
      "/branchSix/branchSixTwigOne.png",
      "/branchSix/branchSixTwigTwo.png",
      "/branchSix/branchSixTwigThree.png",
    ],
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

  // render component
  return (
    <div className={`branch-type-${branchType}`}>
      <Navbar />
      {/* back button to return to tree view */}
      <div className="back-to-tree" onClick={() => navigate("/")}>
        <img src="/chevronGrey.png" alt="Back" className="back-chevron" />
        <span className="back-text">Back to Tree</span>
      </div>
      {/* background image */}
      <img
        src="/branchBackground.png"
        alt="Branch Background"
        className="branch-background-image"
      />
      {/* wooden sign for displaying/editing branch or twig info */}
      {showWoodenSign && (
        <div className={`wooden-sign-container ${isWoodenSignLeft() ? 'left-sign' : 'right-sign'}`}>
          <WoodenSign
            title={isTwigMode ? twigName : branchName}
            description={isTwigMode ? twigDescription : branchDescription}
            onSubmit={handleSubmitBranch}
            onDelete={handleDeleteBranch}
            onCancel={handleCancel}
            onAddTwig={handleAddTwig}
            readOnly={false}
            initialEditMode={isEditMode}
            mode={isTwigMode ? "twig" : "branch"}
          />
        </div>
      )}
      {/* branch image showing current number of twigs */}
      <img className="branch-image" src={twigImages[currentTwigIndex]} alt="Branch" />
    </div>
  );
};

export default Branch;
