import React, { useState, useEffect, memo } from "react";
import "./WoodenSign.css";
import CustomButton from "./CustomButton";
import woodenSign from "../../assets/woodenSign.png";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const WoodenSign = memo(
  ({
    title,
    description,
    onSubmit,
    onDelete,
    onCancel,
    onAddTwig,
    onAddLeaf,
    readOnly,
    initialEditMode = false,
    mode = "branch",
    showAddLeaf = false,
  }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);

    useEffect(() => {
      setIsEditing(initialEditMode);
      setEditTitle(title);
      setEditDescription(description);
    }, [initialEditMode, title, description]);

    const debouncedSetEditTitle = debounce((value) => setEditTitle(value), 150);
    const debouncedSetEditDescription = debounce((value) => setEditDescription(value), 150);

    const handleSubmit = () => {
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
      const confirmMessage = 
        mode === "branch" 
          ? "Are you sure you want to delete this branch? This will delete all twigs and leaves grown on it."
          : mode === "twig"
          ? "Are you sure you want to delete this twig? This will delete all leaves grown on it."
          : "Are you sure you want to delete this leaf?";

      if (window.confirm(confirmMessage)) {
        onDelete();
      }
    };

    return (
      <div className="wooden-sign-container">
        <img src={woodenSign} alt="Wooden Sign" className="wooden-sign-image" />
        <div className="wooden-sign-content">
          {isEditing ? (
            <>
              <input
                type="text"
                defaultValue={editTitle}
                onChange={(e) => debouncedSetEditTitle(e.target.value)}
                placeholder={mode === "branch" ? "Enter branch name" : "Enter twig name"}
                className="wooden-sign-title"
              />
              <textarea
                defaultValue={editDescription}
                onChange={(e) => debouncedSetEditDescription(e.target.value)}
                placeholder={
                  mode === "branch" ? "Enter branch description" : "Enter twig description"
                }
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
                  <CustomButton text="Add Twig" color="green" onClick={onAddTwig} />
                )}
                {showAddLeaf && (
                  <CustomButton text="Add Leaf" color="green" onClick={onAddLeaf} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default WoodenSign;
