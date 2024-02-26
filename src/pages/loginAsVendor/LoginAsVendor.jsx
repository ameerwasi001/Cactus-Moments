import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { radio, radioFilled } from "../../assets";
import { Footer, TextInput } from "../../components";
import { getAllParams, setParam } from "../../urlParams";
import DropDownDate from "../../components/dropDownDate/dropDownDate";
import Navbar from "../../components/navBar/Navbar";
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import { ScaleLoader } from "react-spinners";
import { delKey, getKey, req, setKey } from "../../requests";
import swal from 'sweetalert';

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
  const vendor = JSON.parse(getKey('vendor') ?? null)

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
  const [email, setEmail] = useState(vendor?.email ? vendor?.email : "")
  const [password, setPassword] = useState("")
  const [number, setNumber] = useState("")
  const [city, setCity] = useState("")
  const [postCode, setPostCode] = useState("")
  const [address1, setAddres1] = useState("")
  const [address2, setAddres2] = useState("")
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

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
          <h1>{mostRequired ? (getKey('vendor') ? 'Commandes magasin' : 'Adresse de connexion magasin') : `Adresse d'envoi`}</h1>

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
                      className="choice-fill"
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

                  {!vendor && <TextInputBilling
                    inputStyle={{ width: "65%" }}
                    title={"Email"}
                    type={"email"}
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                  />}
                  <TextInputBilling
                    inputStyle={{ width: "65%" }}
                    title={"Mot de passe"}
                    type={"password"}
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                  />

                </div>
              </>
            }
          </div>
        </div>
        <div className="billing-address-move-next-main-container" style={{ justifyContent: 'center' }}>
          <div
            style={{ opacity: 
              (
                (email && email.includes("@") && email.includes(".")) &&
                (password && password.length >= 8)
              ) ? 
                1 : 
                0.5 
            }}
            onClick={async () => {
              const alreadySignedIn = !!JSON.parse(getKey('vendor') ?? null)
              setLoading(true)
              const { vendors: [vendor] } = await req('GET', `/user/vendor?query=${encodeURIComponent(JSON.stringify({ email, password }))}`)
              if(vendor) {
                if(alreadySignedIn && window.location.href.includes('?logout')) {
                  delKey('vendor')
                  navigate('/')
                }
                if(alreadySignedIn) return navigate('/orders')

                setKey("vendor", JSON.stringify(vendor))
                navigate('/')
              }
              else swal({
                title: "Error",
                text: "Incorrect email or password",
                icon: "error",
                dangerMode: true,
              })
              setLoading(false)
            }}
            className="billing-address-move-next-btn-container"
          >
            {loading ? <ScaleLoader color="#fff"/> : <p>Connexion</p>}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BillingAdress;
