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
    title: "Mme",
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

const BillingAdress = () => {
  const { product, adults, children } = getAllParams()
  const { state } = useLocation()
  const selections = state?.selections
  const withCard = selections?.withCard
  const minorBilling = selections?.minorBilling
  const showBillingScreenForCard = selections?.showBillingScreenForCard
  const onlyEmail = !selections?.withCard
  console.log("BILLING", selections?.selectedCardPayment)
  console.log("FSELECT", selections)
  const navigate = useNavigate();
  const [ischecked, setIschecked] = useState(false);
  const [selectMr, setSelectMr] = React.useState({ Id: 1, title: "Mr" });
  const [dayselect, setDaySelected] = useState({ label: "1", value: "1" });
  const [countryselect, setCountrySelected] = useState({
    label: "France",
    value: "france",
  });
  const [monthSelect, setMonthSelected] = useState({
    label: "January",
    value: "january",
  });
  const [yearSelect, setYearSelect] = useState({
    label: "2000",
    value: "2000",
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

  const countryArr = [
    { label: "France", value: "france" },
    { label: "Belgique", value: "belgique" },
    { label: "Luxembourg", value: "luxembourg" },
    { label: "Allemagne", value: "allemagne" },
    { label: "Espagne", value: "espagne" },
    // showBillingScreenForCard ? null : { label: "USA", value: "Usa" },
  ].filter(x => !!x);

  useEffect(() => {
    for (let i = 1; i < 32; i++) {
      dayArr.push({ label: i, value: i });
    }

    for (let i = 1946; i <= 2023; i++) {
      yearArr.push({ label: i, value: i });
    }
  }, []);

  const mostRequired = minorBilling || !withCard

  const isCharacter = ch => 'abcdefghijklmnopqrstuvwxyz'.split("").map(x => [x, x.toLocaleUpperCase()]).reduce((a, b) => [...a, ...b], []).includes(ch)

  return (
    <>
      <Navbar />
      <div className="billing-address-main-container">
        <div className="billing-address-add-billing-main-container">
          <h1>{mostRequired ? 'Adresse de facturation' : `Adresse d'envoi`}</h1>

          <div id="err" style={{ display: error ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', minHeight: '20px', background: 'pink', border: '1px red solid', borderRadius: '5px', margin: '5px' }}>{error}</div>
          {!onlyEmail && <div className="billing-address-select-mr-container">
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
          </div>}
          <div className="billing-address-add-billing-container" style={{ justifyContent: "space-between" }}>
            {
              <>
                <div className="billing-address-input-container1" style={{ width: onlyEmail ? "90%": undefined }}>
                  {!onlyEmail && <>
                    <TextInputBilling
                      inputStyle={{ width: "70%" }}
                      title={"Prénom*"}
                      value={firstName}
                      onChange={ev => setFirstName(ev.target.value.split("").map(ch => isCharacter(ch) ? ch : "").join(""))}
                      type={"text"}
                    />
                    <TextInputBilling
                      inputStyle={{ width: "70%" }}
                      title={"Nom de famille*"}
                      value={lastName}
                      onChange={ev => setLastName(ev.target.value.split("").map(ch => isCharacter(ch) ? ch : "").join(""))}
                      type={"text"}
                    />
                  </>}

                  <TextInputBilling
                    inputStyle={{ width: "65%" }}
                    title={"Adresse mail*"}
                    type={"email"}
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                  />
                  {!onlyEmail && <>
                    <TextInputBilling
                      inputStyle={{ width: "75%" }}
                      title={"Numéro de téléphone*"}
                      type={"number"}
                      value={number}
                      onChange={ev => setNumber(ev.target.value)}
                    />
                  </>}
                  
                  {!onlyEmail && <div className="text-input-billing-main-container">
                    <div className="text-input-billing-divider-container">
                      <h3>Date de naissance*</h3>
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
                  </div>}
                </div>
                {!onlyEmail && <div className="billing-address-input-container2">
                  <div
                    style={{ width: "100%" }}
                    className="text-input-billing-main-container"
                  >
                    <div className="text-input-billing-divider-container">
                      <h3>Pays{mostRequired ? '' : '*'}</h3>
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
                    title={`Ville${mostRequired ? '' : '*'}`}
                    type={"text"}
                    value={city}
                    onChange={ev => setCity(ev.target.value)}
                  />
                  <TextInputBilling
                    inputStyle={{ width: "75%" }}
                    title={`Code postal${mostRequired ? '' : '*'}`}
                    extraDividerStyles={{ marginRight: "1rem" }}
                    type={"text"}
                    value={postCode}
                    onChange={ev => {
                      setPostCode(ev.target.value.split("").map(ch => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(x => x.toString()).includes(ch) ? ch : "").join(""))
                    }}
                  />
                  <TextInputBilling
                    inputStyle={{ width: "75%" }}
                    title={"Adresse"}
                    type={"text"}
                    value={address1}
                    onChange={ev => setAddres1(ev.target.value)}
                  />
                  <TextInputBilling
                    inputStyle={{ width: "65%" }}
                    title={"Adresse line 2"}
                    type={"text"}
                    value={address2}
                    onChange={ev => setAddres2(ev.target.value)}
                  />
                </div>}
              </>
            }
          </div>
        </div>
        <div className="billing-address-move-next-main-container">
          <div className="billing-address-checkBox-container">
            <input
              checked={ischecked}
              onChange={() => setIschecked(!ischecked)}
              type="checkbox"
            />
            {/* <p>
              I Agree with all{" "}
              <span style={{ textDecoration: "underline" }}>
                term & Conditions Contact us for more details
              </span>
            </p> */}
            <p>Acceptez nos conditions générales de vente.</p>
          </div>
          <div
            style={{ opacity: 
              (
                (!mostRequired && (ischecked && email.includes("@") && Object.entries({day: dayselect.value, country: countryselect.value, month: monthSelect.value, year: yearSelect.value, firstName, lastName, email, number, city, postCode, addressLine1: address1}).map(([_, v]) => !!v).reduce((a, b) => a && b, true))) ||
                (mostRequired && ischecked && email.includes("@") && Object.entries({lastName, number, email}).map(([_, v]) => !!v).reduce((a, b) => a && b, true)) ||
                (onlyEmail && ischecked && email && email.includes("@"))
              ) ? 
                1 : 
                0.5 
            }}
            onClick={() => {
              console.log("SELECTECTIONSS", onlyEmail)
              if(!ischecked) return setError("L'accord avec les termes et conditions est requis.")
              let error = ""
              if(!onlyEmail) {
                const notEmpty = {day: dayselect.value, country: countryselect.value, month: monthSelect.value, year: yearSelect.value, firstName, lastName, email, number, city, postCode, addressLine1: address1}
                const notEmptyForCode = {lastName, number, email}
                if(!email.includes("@")) return 
                if(!mostRequired) Object.entries(notEmpty).forEach(([f, x]) => {
                  if(!x) error = `${f} is required`
                  window.scrollTo(0, 0)
                }) 
                else Object.entries(notEmptyForCode).forEach(([f, x]) => {
                  if(!x) error = `${f} is required`
                  window.scrollTo(0, 0)
                }) 
                if(error) {
                  window.scrollTo(0, 0)
                  return setError(error)
                }
              } else {
                if(!email || !email.includes("@")) {
                  error = "Email is Required"
                  window.scrollTo(0, 0)
                  return setError(error)
                }
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
                  ...(selections ? selections : {})
                }
              })
            }}
            className="billing-address-move-next-btn-container"
          >
            <p>Suivant</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BillingAdress;
