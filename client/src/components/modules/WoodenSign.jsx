import React, { useState } from "react";
import "./WoodenSign.css";
import CustomButton from "./CustomButton";

const WoodenSign = ({ title, description, onSubmit, onDelete, onCancel, readOnly, initialEditMode = false }) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const handleSubmit = () => {
    onSubmit(editTitle, editDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
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
              placeholder="Enter branch name"
              className="wooden-sign-title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Enter branch description"
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
              <CustomButton text="Add Twig" color="green" onClick={() => {}} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WoodenSign;
