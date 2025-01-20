import React, { useState, useEffect } from "react";
import "./WoodenSign.css";
import CustomButton from "./CustomButton";

const WoodenSign = ({ 
  title, 
  description, 
  onSubmit, 
  onDelete, 
  onCancel, 
  onAddTwig, 
  readOnly, 
  initialEditMode = false,
  mode = "branch" // new prop to distinguish between branch and twig modes
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  useEffect(() => {
    setIsEditing(initialEditMode);
    // on initial load, set the edit title and description to the title and description passed in
    setEditTitle(title);
    setEditDescription(description);
  }, [initialEditMode, title, description]);

  const handleSubmit = () => {
    // pass in mode prop to distinguish between submission type
    // if mode is twig, then we need to create a new twig
    // if mode is branch, then we need to update the branch
    // basically submit can be used for both twig and branch
    onSubmit(editTitle, editDescription, mode);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this branch? Deleting a branch will delete all twigs grown on it.")) {
      onDelete();
    }
  };

  return (
    <div className="wooden-sign-container">
      <img src="/woodenSign.png" alt="Wooden Sign" className="wooden-sign-image" />
      <div className="wooden-sign-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder={mode === "branch" ? "Enter branch name" : "Enter twig name"}
              className="wooden-sign-title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={mode === "branch" ? "Enter branch description" : "Enter twig description"}
              className="wooden-sign-description"
            />
          </>
        ) : (
          <>
            <h2 className="wooden-sign-title">{title}</h2>
            <p className="wooden-sign-description">{description}</p>
          </>
        )}
      </div>
      {!readOnly && (
        <div className="wooden-sign-buttons">
          {isEditing ? (
            <>
              <CustomButton text="Submit" color="green" onClick={handleSubmit} />
              <CustomButton text="Cancel" color="red" onClick={handleCancel} />
            </>
          ) : (
            <>
              <CustomButton text="Edit" color="white" onClick={() => setIsEditing(true)} />
              <CustomButton text="Delete" color="red" onClick={handleDelete} />
              {mode === "branch" && (
                <CustomButton 
                  text="Add Twig" 
                  color="green" 
                  onClick={onAddTwig}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WoodenSign;
