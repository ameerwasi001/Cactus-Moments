import React, { useState } from "react";
import { creditCardBlack, radioFilled, successGif } from "../../assets";
import { NavBar, Footer } from "../../components";
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import "./payment.css";

const Payment = () => {
  const [next, setNext] = useState(true);
  return (
    console.log(next),
    (
      <>
        <NavBar />

        <div className="billing-address-main-container">
          {next ? (
            <>
              <div className="payment-method-price-main-container">
                <h2>
                  Total <span style={{ color: "#666666" }}>Incl .Tax</span>
                </h2>
                <h2>$ 44.80</h2>
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
                      type={"number"}
                      title={"Card Number"}
                      placeholder={"4358 5495 3262 4637"}
                    />
                  </div>
                  <div className="payment-input-value-card-info-container">
                    <TextInputBilling
                      mainWidth={{ width: "47%" }}
                      inputStyle={{ mainWidth: "40%" }}
                      type={"number"}
                      title={"Expiry"}
                      placeholder={"MM/YY"}
                    />
                    <TextInputBilling
                      mainWidth={{ width: "47%" }}
                      inputStyle={{ mainWidth: "40%", marginLeft: "0.5rem" }}
                      flag={true}
                      type={"number"}
                      title={"CCV"}
                      placeholder={"3 digit"}
                    />
                  </div>
                  <div
                    onClick={() => setNext(false)}
                    className="payment-btn-main-container"
                  >
                    <p>$44.80 Pay</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="after-payment-main-container">
              <img src={successGif} alt="gif" />
              <h2>Your Order placed Succesfully</h2>
              <p>
                Your order Number is{" "}
                <span style={{ color: "#333333" }}>#545734</span> .We send an
                email to you and You will received your Order with in 5 to 7
                working days thanks.
              </p>
            </div>
          )}
        </div>
        <Footer />
      </>
    )
  );
};

export default Payment;
