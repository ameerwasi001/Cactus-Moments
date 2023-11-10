import React, { useState } from "react";
import { emailIcon, locationIcon, phoneIcon } from "../../assets";
import "./contactUsView.css";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function ContactUsView(props) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const queryArray = [
    {
      id: 1,
      title: "E-Mail",
      des: "info@cactusmoments.com",
      icon: emailIcon,
    },
    {
      id: 2,
      title: "Call",
      des: "+352691 199 068",
      icon: phoneIcon,
    },
    // {
    //   id: 3,
    //   title: "Location",
    //   des: "101 street 2714 California, Usa",
    //   icon: locationIcon,
    // },
  ];
  return (
    <div className="cactus-dashboard-contact_us_top_view" style={props.style}>
      <div className="cactus-dashboard-contact_us_title_view">
        <h1>Contactez-nous </h1>
        <h2>Vous pouvez nous contacter si  vous avez des questions pour nous. </h2>
      </div>
      <div className="cactus-dashboard-contact_us_forms_top_view">
        <div className="cactus-dashboard-contact_us_query_view">
          <h3>Vous pouvez nous contacter si  vous avez des questions pour nous. </h3>
          {queryArray.map((item) => {
            return (
              <div className="cactus-dashboard-contact_us_email_detail_view">
                <img alt="" src={item.icon} />
                <div>
                  <h4>{item.title}</h4>
                  <h5>{item.des}</h5>
                </div>
              </div>
            );
          })}
        </div>
        {submitted ? <div className="cactus-dashboard-contact_us_form_view" >
        <div style={{ display: 'flex', justifyContent: 'center', width: '500px', fontSize: '20px', minHeight: '200px', alignItems: 'center', minHeight: '20px', background: 'lightgreen', border: '1px darkgreen solid', borderRadius: '5px', margin: '5px' }}>
          Thanks for contacting us
        </div>
        </div> : <div className="cactus-dashboard-contact_us_form_view">
          {error && <div className="cactus-dashboard-contact_us_form_view">
            <div style={{ display: 'flex', justifyContent: 'center', width: '300px', fontSize: '20px', minHeight: '50px', alignItems: 'center', background: 'pink', border: '1px red solid', borderRadius: '5px', margin: '5px' }}>{error}</div>
          </div>}
          <div className="cactus-dashboard-contact_us_form_input_view">
            <input placeholder="Full Name" onChange={ev => props.setFullName(ev.target.value)} value={props.fullName} />
          </div>
          <div className="cactus-dashboard-contact_us_form_input_view">
            <input placeholder="Email address" onChange={ev => props.setEmail(ev.target.value)} value={props.email} />
          </div>
          <div className="cactus-dashboard-contact_us_form_input_view">
            <textarea placeholder="Message" onChange={ev => props.setMessage(ev.target.value)} value={props.message} />
          </div>
          <div onClick={() => {
            if(!props.message) setError('Messgae is required')
            else if(!props.email) setError('Email is required')
            else if(!props.fullName) setError('Name is required')
            else if(!validateEmail(props.email)) setError('Invalid Email')
            else setSubmitted(true)
          }} style={{ cursor: 'pointer' }} className="cactus-dashboard-contact_us_form_button_view">
            <h6>Send</h6>
          </div>
        </div>}
      </div>
    </div>
  );
}
