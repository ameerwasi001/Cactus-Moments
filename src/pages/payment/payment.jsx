import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { creditCardBlack, radioFilled, successGif } from "../../assets";
import { NavBar, Footer } from "../../components";
import { req } from "../../requests";
import { getAllParams, setParam } from "../../urlParams";
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import "./payment.css";

const Payment = () => {
  const { state: { selections: {product, ...restProduct} } } = useLocation()
  const [next, setNext] = useState(true);
  const [cardNumber, setCardNumber] = useState("")
  const [cvv, setCvv] = useState("")
  const [expiry, setExpiry] = useState("")
  const [lastExpiryLength, setLastExpiryLength] = useState(0)
  const [error, setError] = useState("")
  return (
    null,
    (
      <>
        <NavBar />

        <div className="billing-address-main-container">
          {error && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20px', background: 'pink', border: '1px red solid', borderRadius: '5px', margin: '5px' }}>{error}</div>}
          {next ? (
            <>
              <div className="payment-method-price-main-container">
                <h2>
                  Total <span style={{ color: "#666666" }}>Incl .Tax</span>
                </h2>
                <h2>${product.price ?? 10}</h2>
              </div>
              <div className="payment-method-credit-card-main-container">
                <div className="payment-method-credit-card-title-container">
                  <div className="paymwnt-methood-credit-card-img-container">
                    <img src={radioFilled} alt="img" />
                    <div className="payment-method-credit-card-img">
                      <img src={creditCardBlack} alt="img" />
                    </div>
                    <h2>Credit card</h2>
                  </div>
                  <div></div>
                </div>
                <div className="payment-text-input-main-container">
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
                      title={"Card Number"}
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
                      title={"Expiry"}
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
                  <div
                    onClick={() => {
                      let n = 0
                      for(const ch of cardNumber)
                        if([1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(x => `${x}`).includes(ch)) n += 1
                      if(n != 16) return setError("The card must have the format XXXX XXXX XXXX XXXX")
                      if(expiry.length != 5) return setError("The expiry formst must be MM/YY")
                      if(cvv.length != 3) return setError("The expiry formst must be MM/YY")
                      req('POST', '/user/order', {
                        product: product._id,
                        cardNumber,
                        cvv,
                        expiry,
                        product: product._id,
                        selections: {product, ...restProduct}
                      }).then(_ => _)
                      setNext(false)
                    }}
                    className="payment-btn-main-container"
                  >
                    <p>Pay ${product.price ?? 10}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="after-payment-main-container">
              <img src={successGif} alt="gif" />
              <div className="after-payment-text-main-container">
                <h2>Your Order placed Succesfully</h2>
                <p>
                  Your order Number is{" "}
                  <span style={{ color: "#333333" }}>#545734</span> .We send an
                  email to you and You will received your Order with in 5 to 7
                  working days thanks.
                </p>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </>
    )
  );
};

export default Payment;
