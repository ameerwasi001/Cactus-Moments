import React, { useState } from "react";
import { radio, radioFilled } from "../../assets";
import { Footer, TextInput } from "../../components";
import DropDownDate from "../../components/dropDownDate/dropDownDate";
import Navbar from "../../components/navBar/Navbar";
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import "./billingAdress.css";

const mrArr = [
  {
    id: 1,
    title: "Mr",
  },
  {
    id: 1,
    title: "Mrs",
  },
];

const yearArr = [
  {
    label: "1995",
    value: 1995,
  },
  {
    label: "1996",
    value: 1996,
  },
  {
    label: "1997",
    value: 1997,
  },
  {
    label: "1998",
    value: 1998,
  },
  {
    label: "1999",
    value: 1999,
  },
  {
    label: "2000",
    value: 2000,
  },
  {
    label: "2001",
    value: 2001,
  },
];

const dayArr = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
];

const monthArr = [
  { label: "january", value: "january" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "May", value: "May" },
  { label: "Jun", value: "Jun" },
  { label: "July", value: "July" },
];

const countryArr = [
  { label: "UK", value: "UK" },
  { label: "Germany", value: "germany" },
  { label: "France", value: "France" },
  { label: "Spain", value: "Spain" },
  { label: "England", value: "England" },
  { label: "USA", value: "Usa" },
];

const BillingAdress = () => {
  const [selectMr, setSelectMr] = React.useState({ Id: 1, title: "Mr" });
  const [dayselect, setDaySelected] = useState({ label: "Day", value: "Day" });
  const [countryselect, setCountrySelected] = useState({
    label: "England",
    value: "England",
  });
  const [monthSelect, setMonthSelected] = useState({
    label: "Month",
    value: "Month",
  });
  const [yearSelect, setYearSelect] = useState({
    label: "Year",
    value: "Year",
  });
  return (
    <>
      <Navbar />

      <div className="billing-address-main-container">
        <div className="billing-address-add-billing-main-container">
          <h1>Billing Address</h1>

          <div className="billing-address-select-mr-container">
            <div className="billing-address-select-mr-sub-container">
              {mrArr.map((item) => (
                <>
                  <div
                    onClick={() => setSelectMr(item)}
                    className="billing-address-radio-btn-container"
                  >
                    <img
                      src={selectMr.title == item.title ? radioFilled : radio}
                    />
                    <p>{item.title}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
          <div className="billing-address-add-billing-container">
            <div className="billing-address-input-container1">
              <TextInputBilling title={"First Name*"} type={"text"} />
              <TextInputBilling title={"Last Name*"} type={"text"} />
              <TextInputBilling title={"Email Address*"} type={"email"} />
              <TextInputBilling title={"Mobile*"} type={"number"} />
              <div className="text-input-billing-main-container">
                <div className="text-input-billing-divider-container">
                  <h3>Date of Birth*</h3>
                  <div className="text-input-billing-input-divider"></div>
                </div>
                <DropDownDate
                  options={dayArr}
                  selected={dayselect}
                  setSelected={setDaySelected}
                  bg={{ width: "10rem" }}
                />
                <div className="text-input-billing-input-divider"></div>
                <DropDownDate
                  options={monthArr}
                  selected={monthSelect}
                  setSelected={setMonthSelected}
                  bg={{ width: "10rem" }}
                />
                <div className="text-input-billing-input-divider"></div>
                <DropDownDate
                  options={yearArr}
                  selected={yearSelect}
                  setSelected={setYearSelect}
                  bg={{ width: "10rem" }}
                />
              </div>
            </div>
            <div className="billing-address-input-container2">
              <div
                style={{ width: "100%" }}
                className="text-input-billing-main-container"
              >
                <div className="text-input-billing-divider-container">
                  <h3>Date of Birth*</h3>
                  <div className="text-input-billing-input-divider"></div>
                </div>
                <DropDownDate
                  options={countryArr}
                  selected={countryselect}
                  setSelected={setCountrySelected}
                  bg={{ width: "40rem" }}
                />
              </div>
              <TextInputBilling title={"City*"} type={"text"} />
              <TextInputBilling title={"Post Code*"} type={"number"} />
              <TextInputBilling title={"Address*"} type={"text"} />
              <TextInputBilling title={"Address line 2*"} type={"text"} />
            </div>
          </div>
        </div>
        <div className="billing-address-move-next-main-container">
          <div className="billing-address-checkBox-container">
            <p>
              I Agree with all{" "}
              <span style={{ textDecoration: "underline" }}>
                term & Conditions Contact us for more details
              </span>
            </p>
          </div>
          <div className="billing-address-move-next-btn-container">
            <p>Next</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BillingAdress;
