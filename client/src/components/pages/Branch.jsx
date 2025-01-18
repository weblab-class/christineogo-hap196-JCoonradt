import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../modules/Navbar";
import "./Branch.css";
import CustomButton from "../modules/CustomButton";
import WoodenSign from "../modules/WoodenSign";

const Branch = () => {

  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [showWoodenSign, setShowWoodenSign] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [branchDescription, setBranchDescription] = useState("");

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

  return (
    <div>
      <Navbar />
      <img
        src="/branchBackground.png"
        alt="Branch Background"
        className="branch-background-image"
      />
      {/* <div className="add-twig-container">
        <CustomButton text="Add Twig" />
      </div> */}
      {showWoodenSign && (
        <WoodenSign
          title={branchName}
          description={branchDescription}
          onSubmit={handleSubmitBranch}
          onCancel={() => setIsEditMode(false)}
          readOnly={false}
          initialEditMode={isEditMode}
        />
      )}
      <img className="branch-image" src="/leftBranchNoTwigs.png" alt="Branch" />
    </div>
  );
};

export default Branch;
