import React, { useRef } from "react";
import { arrowDown, creditCard } from "../../assets";
import "./textInputBilling.css";

const TextInputBilling = ({
  title,
  type,
  name,
  flag,
  placeholder,
  value,
  onChange,
  inputStyle,
  mainWidth,
  extraDividerStyles,
}) => {
  const ref = useRef(null)
  return (
    <div onClick={() => ref?.current?.focus()} style={mainWidth} className="text-input-billing-main-container">
      <div className="text-input-billing-divider-container">
        <h3>{title}</h3>
        <div className="text-input-billing-input-divider" style={extraDividerStyles ? extraDividerStyles : {}}></div>
      </div>

      <input
        style={inputStyle}
        type={type}
        name={name}
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {flag ? <img src={creditCard} alt="input" /> : <div />}
    </div>
  );
};

export default TextInputBilling;
