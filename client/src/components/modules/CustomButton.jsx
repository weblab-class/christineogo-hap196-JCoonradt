import React from "react";
import "./CustomButton.css";

const CustomButton = ({ text, onClick, color = "brown", disabled = false }) => {
  const colorClass = `text-${color === "brown" ? "green" : color}`;

  return (
    <button className={`custom-button ${colorClass}`} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default CustomButton;
