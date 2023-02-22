import React from 'react'
import { emailIcon, locationIcon, phoneIcon } from '../../assets'
import './contactUsView.css'

export default function ContactUsView(props) {
    const queryArray = [
        {
            id: 1,
            title: 'E-mail',
            des: 'Cactusmpments@gmail.Com',
            icon: emailIcon
        },
        {
            id: 2,
            title: 'Call',
            des: '+1 202 555 0156',
            icon: phoneIcon
        },
        {
            id: 3,
            title: 'Location',
            des: '101 street 2714 California, Usa',
            icon: locationIcon
        },

    ]
    return (
        <div className="cactus-dashboard-contact_us_top_view" style={props.style}>
            <div className="cactus-dashboard-contact_us_title_view">
                <h1>Contact Us</h1>
                <h2>You can contact us if you have any type of query for us </h2>
            </div>
            <div className="cactus-dashboard-contact_us_forms_top_view">
                <div className="cactus-dashboard-contact_us_query_view">
                    <h3>You can contact us if you have any type of query for us </h3>
                    {queryArray.map((item) => {
                        return (
                            <div className="cactus-dashboard-contact_us_email_detail_view">
                                <img alt='' src={item.icon} />
                                <div>
                                    <h4>{item.title}</h4>
                                    <h5>{item.des}</h5>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="cactus-dashboard-contact_us_form_view">
                    <div className="cactus-dashboard-contact_us_form_input_view">
                        <input placeholder="Full Name" />
                    </div>
                    <div className="cactus-dashboard-contact_us_form_input_view">
                        <input placeholder="Email address" />
                    </div>
                    <div className="cactus-dashboard-contact_us_form_input_view">
                        <textarea placeholder="Email address" />
                    </div>
                    <div className="cactus-dashboard-contact_us_form_button_view">
                        <h6>Send</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}
