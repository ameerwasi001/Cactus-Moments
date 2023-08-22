import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { radio, radioFilled } from "../../assets";
import { Footer, TextInput } from "../../components";
import { getAllParams, setParam } from "../../urlParams";
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

const yearArr = [];

const dayArr = [];

const monthArr = [
  { label: "January", value: "january" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "april" },
  { label: "May", value: "May" },
  { label: "Jun", value: "Jun" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
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
  const { product, adults, children } = getAllParams()
  const { state: {selections} } = useLocation()
  const navigate = useNavigate();
  const [ischecked, setIschecked] = useState(false);
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
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const [city, setCity] = useState("")
  const [postCode, setPostCode] = useState("")
  const [address1, setAddres1] = useState("")
  const [address2, setAddres2] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    for (let i = 1; i < 32; i++) {
      dayArr.push({ label: i, value: i });
    }

    for (let i = 1946; i <= 2023; i++) {
      yearArr.push({ label: i, value: i });
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="billing-address-main-container">
        <div className="billing-address-add-billing-main-container">
          <h1>Billing Address</h1>

          <div id="err" style={{ display: error ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', minHeight: '20px', background: 'pink', border: '1px red solid', borderRadius: '5px', margin: '5px' }}>{error}</div>
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
              <TextInputBilling
                inputStyle={{ width: "70%" }}
                title={"First Name*"}
                value={firstName}
                onChange={ev => setFirstName(ev.target.value)}
                type={"text"}
              />
              <TextInputBilling
                inputStyle={{ width: "70%" }}
                title={"Last Name*"}
                value={lastName}
                onChange={ev => setLastName(ev.target.value)}
                type={"text"}
              />
              <TextInputBilling
                inputStyle={{ width: "65%" }}
                title={"Email Address*"}
                type={"email"}
                value={email}
                onChange={ev => setEmail(ev.target.value)}
              />
              <TextInputBilling
                inputStyle={{ width: "75%" }}
                title={"Mobile*"}
                type={"number"}
                value={number}
                onChange={ev => setNumber(ev.target.value)}
              />
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
                  bg={{ width: "15rem" }}
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
                  <h3>Country*</h3>
                  <div className="text-input-billing-input-divider"></div>
                </div>
                <DropDownDate
                  options={countryArr}
                  selected={countryselect}
                  setSelected={setCountrySelected}
                  bg={{ width: "40rem" }}
                />
              </div>
              <TextInputBilling
                inputStyle={{ width: "80%" }}
                title={"City*"}
                type={"text"}
                value={city}
                onChange={ev => setCity(ev.target.value)}
              />
              <TextInputBilling
                inputStyle={{ width: "75%" }}
                title={"Post Code*"}
                type={"number"}
                value={postCode}
                onChange={ev => setPostCode(ev.target.value)}
              />
              <TextInputBilling
                inputStyle={{ width: "75%" }}
                title={"Address"}
                type={"text"}
                value={address1}
                onChange={ev => setAddres1(ev.target.value)}
              />
              <TextInputBilling
                inputStyle={{ width: "65%" }}
                title={"Address line 2*"}
                type={"text"}
                value={address2}
                onChange={ev => setAddres2(ev.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="billing-address-move-next-main-container">
          <div className="billing-address-checkBox-container">
            <input
              checked={ischecked}
              onChange={() => setIschecked(!ischecked)}
              type="checkbox"
            />
            <p>
              I Agree with all{" "}
              <span style={{ textDecoration: "underline" }}>
                term & Conditions Contact us for more details
              </span>
            </p>
          </div>
          <div
            style={{ opacity: ischecked ? 1 : 0.5 }}
            onClick={() => {
              console.log("SELECTECTIONSS", selections)
              if(!ischecked) return setError("Agreement with the terms and conditions is requred")
              let error = ""
              const notEmpty = {day: dayselect.value, country: countryselect.value, month: monthSelect.value, year: yearSelect.value, firstName, lastName, email, number, city, postCode, addressLine1: address1}
              Object.entries(notEmpty).forEach(([f, x]) => {
                if(!x) error = `${f} is required`
                window.scrollTo(0, 0)
              })
              if(error) {
                window.scrollTo(0, 0)
                return setError(error)
              }
              navigate(`/payment?${setParam({
                product: product,
                courtesyTitle: selectMr.value,
                day: dayselect.value,
                country: countryselect.value,
                month: monthSelect.value,
                year: yearSelect.value,
                firstName,
                lastName,
                email,
                number,
                city,
                postCode,
                addressLine1: address1,
                adults: adults,
                children: children,
                addressLine2: address2,
              })}`, {
                state: {
                  selections
                }
              })
            }}
            className="billing-address-move-next-btn-container"
          >
            <p>Next</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BillingAdress;
