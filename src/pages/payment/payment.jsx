import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { creditCardBlack, radioFilled, radio, successGif } from "../../assets";
import { NavBar, Footer } from "../../components";
import { getKey, req, setKey } from "../../requests";
import { getAllParams, setParam } from "../../urlParams";
import swal from 'sweetalert';
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./payment.css";

const getPrice = () => (getKey("cart") ?? []).map(order => order?.selections?.product?.price ?? 0).reduce((a, b) => a+b, 0)

const Payment = () => {
  const { state } = useLocation()
  // { selections: {product, ...restProduct} }
  const { product, withCard, minorBilling, ...restProduct } = state ?? {}
  const fromCart = !product
  console.log("product-price", fromCart, product, restProduct)
  const price = fromCart ? getPrice() : product?.price
  const [selectedMethod, setSelectedMethod] = useState(withCard ? "card" : "code")
  const [next, setNext] = useState(true);
  const [cardNumber, setCardNumber] = useState("")
  const [cvv, setCvv] = useState("")
  const [expiry, setExpiry] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [lastExpiryLength, setLastExpiryLength] = useState(0)
  const [error, setError] = useState("")

  const {
    courtesyTitle,
    day,
    country,
    month,
    year,
    firstName,
    lastName,
    email,
    number,
    city,
    postCode,
    addressLine1,
    adults,
    children,
    addressLine2,
    selectedDimension,
    selectedFrame,
  } = getAllParams()

  const getN = () => {
    let n = 0
    for(const ch of cardNumber)
      if([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(x => `${x}`).includes(ch)) n += 1
    return n
  }

  useEffect(() => {
    if(error) {
      swal({
        title: "Error",
        text: error,
        icon: "error",
        dangerMode: true,
        onClose: () => {
          setError("")
        }
      })
      setTimeout(() => {
        setError("")
      }, 3_000)
    }
  }, [error])

  return (
    null,
    (
      <>
        <NavBar />

        <div className="billing-address-main-container">
          {next ? (
            <>
              <div className="payment-method-price-main-container">
                <h2>
                  Total <span style={{ color: "#666666" }}> TTC</span>
                </h2>
                <h2>${price ?? 10}</h2>
              </div>
              <div className="payment-method-credit-card-main-container">
                <div className="payment-method-credit-card-title-container">
                  {selectedMethod == "card" && <div className="paymwnt-methood-credit-card-img-container">
                    <div className="payment-method-credit-card-img">
                      <img src={creditCardBlack} alt="img" style={{ cursor: "pointer" }} />
                    </div>
                    <h2>Carte de crédit</h2>
                  </div>}
                  <div></div>
                </div>
                {selectedMethod == "card" && <div className="payment-text-input-main-container">
                  <div style={{ marginTop: "5rem" }}>
                    <TextInputBilling
                      flag={true}
                      value={cardNumber?.split(" ")?.join("").split("")?.map((x, i) => (i+1)%4 == 0 ? `${x} ` : `${x}`)?.join('')?.trim()}
                      onChange={ev => {
                        let n = 0
                        for(const ch of ev.target.value)
                          if([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(x => `${x}`).includes(ch)) n += 1
                        if(n > 16) return
                        setCardNumber(ev.target.value)
                      }}
                      type={"text"}
                      title={"Numéro de carte"}
                      placeholder={"4358 5495 3262 4637"}
                    />
                  </div>
                  <div className="payment-input-value-card-info-container">
                    <TextInputBilling
                      mainWidth={{ width: "47%" }}
                      inputStyle={{ mainWidth: "40%" }}
                      type={"text"}
                      value={expiry}
                      onChange={ev => {
                        const erasing = expiry.split('/').join('').length > ev.target.value.split('/').join('').length
                        if(ev.target.value.length > 5) return
                        setExpiry(ev.target.value?.split("/")?.join("")?.split("")?.map((x, i) => {
                          if(erasing && ev.target.value.length == 3) return `${x}`
                          if(i !== 2) return `${x}`
                          return `/${x}`
                        })?.join(''))
                      }}
                      title={"Date d'expiration "}
                      placeholder={"MM/YY"}
                    />
                    <TextInputBilling
                      mainWidth={{ width: "47%" }}
                      inputStyle={{ mainWidth: "40%", marginLeft: "0.5rem" }}
                      flag={true}
                      value={cvv}
                      onChange={ev => ev.target.value.length < 4 && setCvv(ev.target.value)}
                      type={"number"}
                      title={"CCV"}
                      placeholder={"3 digit"}
                    />
                  </div>
                </div>}
                <div className="payment-method-credit-card-title-container">
                  {selectedMethod == "code" && <div className="paymwnt-methood-credit-card-img-container">
                    <div className="payment-method-credit-card-img">
                      <img src={creditCardBlack} alt="img" style={{ cursor: "pointer" }} />
                    </div>
                    <h2>Code</h2>
                  </div>}
                  <div></div>
                </div>
                {selectedMethod == "code" && <div className="payment-text-input-main-container">
                  <div style={{ marginTop: "5rem" }}>
                      <TextInputBilling
                        flag={true}
                        value={code}
                        onChange={ev => setCode(ev.target.value)}
                        type={"text"}
                        title={"Code"}
                        placeholder={""}
                      />
                    </div>
                </div>}
                <div
                    style={{ marginRight: "1rem", marginLeft: "1rem", opacity: selectedMethod == "card" ? (getN() != 16 || expiry.length != 5 || cvv.length != 3 ? 0.5 : 1) : (code == "" ? 0.5 : 1) }}
                    onClick={async () => {
                      console.log("LOADING-X", loading, selectedMethod, fromCart)
                      if(loading) return
                      if(selectedMethod == "card") {
                        let n = getN()
                        if(n != 16) return setError("The card must have the format XXXX XXXX XXXX XXXX")
                        if(expiry.length != 5) return setError("The expiry formst must be MM/YY")
                        if(cvv.length != 3) return setError("The expiry formst must be MM/YY")
                      }
                      if(selectedMethod == "code") {
                        if(code != "Noel") return setError("Invalid code")
                      }
                      setLoading(true)
                      if(fromCart) {
                        let ordered = 0
                        const cartData = getKey("cart") ?? []
                        const promises = []
                        for(const order of cartData) {
                          const { product, ...restProduct } = order.selections
                          promises.push(req('POST', '/user/order', {
                            product: product._id,
                            bill: {
                              cardNumber,
                              cvv,
                              expiry,
                              courtesyTitle,
                              day,
                              country,
                              month,
                              year,
                              firstName,
                              lastName,
                              email,
                              number,
                              city,
                              postCode,
                              addressLine1,
                              adults,
                              children,
                              addressLine2,
                              selectedDimension,
                              selectedFrame,
                              code,
                              withCard,
                              ...Object.fromEntries(Object.entries(restProduct).filter(([k, v]) => typeof v != "object")),
                              orderDate: new Date().toLocaleDateString(),
                            },
                            product: product._id,
                            selections: {product, ...restProduct}
                          }, err => {
                            setLoading(false)
                            setError(err)
                          }, () => {
                            ordered += 1
                            if(ordered == cartData.length) {
                              setLoading(false)
                              setNext(false)
                              setKey("cart", [])
                            }
                          }))
                        }
                      } else await req('POST', '/user/order', {
                        product: product._id,
                        bill: {
                          cardNumber,
                          cvv,
                          expiry,
                          courtesyTitle,
                          day,
                          country,
                          month,
                          year,
                          firstName,
                          lastName,
                          email,
                          number,
                          city,
                          postCode,
                          addressLine1,
                          adults,
                          children,
                          addressLine2,
                          selectedDimension,
                          selectedFrame,
                          code,
                          ...Object.fromEntries(Object.entries(restProduct).filter(([k, v]) => typeof v != "object")),
                          orderDate: new Date().toLocaleDateString(),
                        },
                        product: product._id,
                        selections: {product, ...restProduct}
                      }, err => {
                        setLoading(false)
                        setError(err)
                      }, () => {
                        setLoading(false)
                        setNext(false)
                      })
                    }}
                    className="payment-btn-main-container"
                  >
                    {loading ? <ScaleLoader color="#fff" /> : <p>Payer €{price ?? 10}</p>}
                  </div>
              </div>
            </>
          ) : (
            <div className="after-payment-main-container">
              <img src={successGif} alt="gif" />
              {minorBilling ? <div className="after-payment-text-main-container">
                <h1>Your Order placed Succesfully</h1>
                <h3>Votre commande a été confirmée avec succès et est en cours de traitement. Nous tenons à vous remercier de votre confiance.</h3>
                <br />
                <h3>Vous avez choisi de récupérer votre colis à notre stand au marché de Noël d'Arras (<span style={{ fontWeight: "bolder" }}>du vendredi 24 novembre au vendredi 30 décembre 2023</span>). Prévoyez environ deux heures pour que votre commande soit prête. </h3>
                <br />
                <br />
                <h6>Heure d'ouverture du marché :  </h6>
                <h6>De lundi à jeudi de 12 h à 20h30</h6>
                <h6>Les vendredis de 12h à 22h</h6>
                <h6>Les samedis de 10h à 22h</h6>
                <h6>Les dimanches de 10h à 20h30</h6>
                <br />
                <br />
                <h6>Voici un récapitulatif de votre commande :</h6>
                <h6>Numéro de commande : {product?._id}</h6>
                <h6>Montant total payé : {product?.price}€</h6>
                <h6>À bientôt, </h6>
                <h6>L'équipe Cactus Moments</h6>
              </div> : (!withCard) ? <div className="after-payment-text-main-container">
                <h1>Cher(e) client(e),</h1>
                <br />
                <h1>Nous vous remercions pour votre commande. </h1>
                <h3>
                  Votre commande a bien été enregistrée dans notre système, et nous sommes prêts à commencer le processus de personnalisation. Avant d'imprimer votre produit, nous vous prions de bien vouloir passer en caisse pour effectuer le paiement nécessaire.
                </h3>
                <br />
                <br />
                <h3>Voici les étapes à suivre pour finaliser votre commande :</h3>
                <ol>
                  <li>Rendez-vous à la caisse de notre stand située au marché de Noël d'Arras.</li>
                  <li>Indiquez votre numéro de commande lors du paiement.</li>
                  <li>Une fois le paiement confirmé, nous commencerons immédiatement à préparer votre commande.</li>
                </ol>
                <h6>Voici un récapitulatif de votre commande :</h6>
                <h6>Numéro de commande : {product?._id}</h6>
                <h6>Montant total payé : {product?.price}€</h6>
                <h6>À bientôt, </h6>
                <h6>L'équipe Cactus Moments</h6>
              </div> : <div className="after-payment-text-main-container">
                <h1>Your Order placed Succesfully</h1>
                <h3>
                  Votre commande a été confirmée avec succès et est en cours de traitement. Nous tenons à vous remercier de votre confiance. Veuillez prévoir 4 jours ouvrables pour la réception de votre colis.
                </h3>
                <br />
                <br />
                <h6>Voici un récapitulatif de votre commande :</h6>
                <h6>Numéro de commande : {product?._id}</h6>
                <h6>Montant total payé : {product?.price}€</h6>
                <h6>À bientôt, </h6>
                <h6>L'équipe Cactus Moments</h6>
              </div>}
              <br />
              <br />
            </div>
          )}
        </div>
        <Footer />
      </>
    )
  );
};

export default Payment;
