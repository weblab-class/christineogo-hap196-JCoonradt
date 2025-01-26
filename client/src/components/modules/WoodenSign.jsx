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

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const WoodenSign = memo(
  ({
    title,
    description,
    link,
    onSubmit,
    onDelete,
    onCancel,
    onAddTwig,
    onAddLeaf,
    readOnly,
    initialEditMode = false,
    mode = "branch",
    showAddLeaf = false,
    disabled = false,
  }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editLink, setEditLink] = useState(link || "");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [linkError, setLinkError] = useState("");

    useEffect(() => {
      setIsEditing(initialEditMode);
      setEditTitle(title);
      setEditDescription(description);
      setEditLink(link || "");
      setUploadedImage(link?.startsWith("data:image") ? link : null);
    }, [initialEditMode, title, description, link]);

    const debouncedSetEditTitle = debounce((value) => setEditTitle(value), 150);
    const debouncedSetEditDescription = debounce((value) => setEditDescription(value), 150);

    const handleLinkChange = (value) => {
      setEditLink(value);
      if (value && !value.startsWith("data:image") && !isValidUrl(value)) {
        setLinkError("Please enter a valid URL (e.g., https://example.com)");
      } else {
        setLinkError("");
      }
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          setLinkError("Image size should be less than 5MB");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result);
          setEditLink(reader.result);
          setLinkError("");
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = () => {
      if (editLink && !editLink.startsWith("data:image") && !isValidUrl(editLink)) {
        setLinkError("Please enter a valid URL before submitting");
        return;
      }
      onSubmit(editTitle, editDescription, mode, editLink);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setEditTitle(title);
      setEditDescription(description);
      setEditLink(link || "");
      setUploadedImage(link?.startsWith("data:image") ? link : null);
      setLinkError("");
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
                placeholder={
                  mode === "branch"
                    ? "Enter branch name"
                    : mode === "twig"
                    ? "Enter twig name"
                    : "Enter leaf name"
                }
                className="wooden-sign-title"
              />
              <textarea
                defaultValue={editDescription}
                onChange={(e) => debouncedSetEditDescription(e.target.value)}
                placeholder={
                  mode === "branch"
                    ? "Enter branch description"
                    : mode === "twig"
                    ? "Enter twig description"
                    : "Enter leaf description"
                }
                className="wooden-sign-description"
              />
              {mode === "leaf" && (
                <div className="wooden-sign-media">
                  <div className="wooden-sign-link-container">
                    <input
                      type="text"
                      value={editLink}
                      onChange={(e) => handleLinkChange(e.target.value)}
                      placeholder="Enter website URL (e.g., https://example.com)"
                      className={`wooden-sign-link ${linkError ? "error" : ""}`}
                    />
                    {linkError && <div className="wooden-sign-link-error">{linkError}</div>}
                  </div>
                  <div className="wooden-sign-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="wooden-sign-image-input"
                    />
                    {uploadedImage && (
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="wooden-sign-image-preview"
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="wooden-sign-title">{title}</h2>
              <p className="wooden-sign-description">{description}</p>
              {mode === "leaf" && link && (
                <div className="wooden-sign-media">
                  {link.startsWith("data:image") ? (
                    <img src={link} alt="Uploaded content" className="wooden-sign-content-image" />
                  ) : isValidUrl(link) ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wooden-sign-content-link"
                    >
                      Visit Link
                    </a>
                  ) : null}
                </div>
              )}
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
                    disabled={disabled}
                  />
                )}
                {showAddLeaf && (
                  <CustomButton 
                    text="Add Leaf" 
                    color="green" 
                    onClick={onAddLeaf}
                    disabled={disabled}
                  />
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
