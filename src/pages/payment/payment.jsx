import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { creditCardBlack, radioFilled, radio, successGif } from "../../assets";
import { NavBar, Footer } from "../../components";
import { getKey, req, setKey } from "../../requests";
import { getAllParams, setParam } from "../../urlParams";
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import swal from 'sweetalert';
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import ScaleLoader from "react-spinners/ScaleLoader";
import "./payment.css";

const getPrice = () => (getKey("cart") ?? []).map(order => order?.selections?.product?.price ?? 0).reduce((a, b) => a+b, 0)
const stripePromise = loadStripe('pk_live_51OEy34JbX5shavtnvHumbLoNAoDYgQl7QYTSa6eN4uiyopxogrzJJPnKacaLVq6UKXWJAAKsqIZfaidfW1g3BJGy00WbYEtGiE');

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
  const [loading, setLoading] = useState(false)
  const [lastExpiryLength, setLastExpiryLength] = useState(0)
  const [error, setError] = useState("")
  const [stripeOptions, setStripeOptions] = useState(null)

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

  useEffect(() => {
    if(selectedMethod != "code") req('POST', '/user/stripe', { amount: 1000 })
      .then(res => setStripeOptions({
        clientSecret: res.paymentIntent,
        appearance: {
          theme: 'flat',
          variables: { colorPrimaryText: '#262626' }
        }
      }))
  }, [])

  const paymentDone = async (code) => {
    console.log("LOADING-X", loading, selectedMethod, fromCart)
    if(loading) return
    if(selectedMethod == "card") {
      // let n = getN()
      // if(n != 16) return setError("The card must have the format XXXX XXXX XXXX XXXX")
      // if(expiry.length != 5) return setError("The expiry formst must be MM/YY")
      // if(cvv.length != 3) return setError("The expiry formst must be MM/YY")
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
  }

  const CheckOutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
  
    return <>
      {selectedMethod == "card" && <div className="payment-text-input-main-container">
        <div style={{ marginBottom: "2rem" }}></div>
        {stripeOptions &&  <PaymentElement />}
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
      <div
        style={{ marginRight: "1rem", marginLeft: "1rem", opacity: false }}
        className="payment-btn-main-container"
        onClick={async () => {
          if(selectedMethod != "code") {
            const {error: submitError} = await elements.submit();
            if(submitError) return setError(submitError.message)
  
            const {error} = await stripe.confirmPayment({
              elements,
              clientSecret: stripeOptions.clientSecret,
              confirmParams: {
                return_url: 'https://example.com/order/123/complete',
              },
              redirect: 'if_required'
            });
            if(error) return setError(error.message)
          }
          await paymentDone()
        }}
      >
        {loading ? <ScaleLoader color="#fff" /> : <p>Commander €{price ?? 10}</p>}
      </div>
    </>
  }

  const CheckOutFormCode = () => {
    const [code, setCode] = useState("")

    return <>
      {selectedMethod == "card" && <div className="payment-text-input-main-container">
        <div style={{ marginBottom: "2rem" }}></div>
        {stripeOptions &&  <PaymentElement />}
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
        style={{ marginRight: "1rem", marginLeft: "1rem", opacity: selectedMethod == "card" ? false : (code == "" ? 0.5 : 1) }}
        className="payment-btn-main-container"
        onClick={async () => {
          await paymentDone(code)
        }}
      >
        {loading ? <ScaleLoader color="#fff" /> : <p>Commander €{price ?? 10}</p>}
      </div>
    </>
  }


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
                <h2>€{price ?? 10}</h2>
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
                {stripeOptions ? <Elements options={stripeOptions} stripe={stripePromise}>
                  <CheckOutForm/>
                </Elements> : selectedMethod == "code" ? <CheckOutFormCode /> : <ScaleLoader color="#2b453e" />}
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
