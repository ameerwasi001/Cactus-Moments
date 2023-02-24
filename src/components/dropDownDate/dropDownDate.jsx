import React, { useState } from "react";
import { arrowDown } from "../../assets";
import "./dropDownDate.css";

const DropDownDate = ({
  selected,
  setSelected,
  options,
  text,
  bg,
  width,
  textStyle,
}) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="dropdown" style={bg}>
      <p style={textStyle}>{text}</p>
      <div
        className="dropdown-btn"
        style={bg}
        onClick={(e) => setIsActive(!isActive)}
      >
        <p style={{ marginLeft: "2rem" }}>{selected.label}</p>
        <img src={arrowDown} alt="icon" />
      </div>
      {isActive && (
        <div style={bg} className="dropdown-content">
          {options.map((option) => (
            <p
              onClick={(e) => {
                setSelected(option);
                setIsActive(false);
              }}
              className="dropdown-item"
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownDate;
