import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./BranchOne.css";
import CustomButton from "../modules/CustomButton";
import WoodenSign from "../modules/WoodenSign";

const BranchOne = () => {

  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");
  const navigate = useNavigate();
  const [currentTwigIndex, setCurrentTwigIndex] = useState(0);
  const twigImages = [
    "/branchOne/branchOneNoTwigs.png",
    "/branchOne/branchOneTwigOne.png",
    "/branchOne/branchOneTwigTwo.png",
    "/branchOne/branchOneTwigThree.png"
  ];

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`/api/branch/${branchId}`);
        if (response.ok) {
          const branchData = await response.json();
          setBranch(branchData);
          setBranchName(branchData.name);
          setBranchDescription(branchData.description);
        } else {
          console.error("Failed to fetch branch data");
        }
      } catch (error) {
        console.error("Failed to fetch branch data:", error);
      }
    };

    if (branchId) {
      fetchBranch();
    }
  }, [branchId]);

  const handleAddTwig = () => {
    if (currentTwigIndex < twigImages.length - 1) {
      setCurrentTwigIndex(currentTwigIndex + 1);
    }
  };

  const handleSubmitBranch = async (title, description) => {
    try {
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
        setIsEditMode(false);
      } else {
        console.error("Failed to update branch");
      }
    } catch (error) {
      console.error("Failed to update branch:", error);
    }
  };

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

return (
  <div>
    <Navbar />
    <div className="back-to-tree" onClick={() => navigate("/")}>
      <img 
        src="/chevronGrey.png" 
        alt="Back" 
        className="back-chevron"
      />
      <span className="back-text">Back to Tree</span>
    </div>
    <img
      src="/branchBackground.png"
      alt="Branch Background"
      className="branch-background-image"
    />
    {showWoodenSign && (
      <div className="wooden-sign-container">
        <WoodenSign
          title={branchName}
          description={branchDescription}
          onSubmit={handleSubmitBranch}
          onDelete={handleDeleteBranch}
          onCancel={() => setIsEditMode(false)}
          onAddTwig={handleAddTwig}
          readOnly={false}
          initialEditMode={isEditMode}
        />
      </div>
    )}
    <img 
      className="branch-image" 
      src={twigImages[currentTwigIndex]} 
      alt="Branch" 
    />
  </div>
);
};

export default BranchOne;
