import React from "react";
import "./CustomButton.css";

const CustomButton = ({ text, onClick, color = "green" }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      <span className={`text-${color}`}>{text}</span>
    </button>
  );
};

export default CustomButton;
