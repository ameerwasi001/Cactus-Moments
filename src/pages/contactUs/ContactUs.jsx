import React from "react";
import { aboutUsBanner, aboutUsBorder, contactUsBanner, dummyFive, dummyFour, heart } from "../../assets";
import { ContactUsView, Footer, NavBar, TempleteSliderView, } from "../../components";
import './contactUs.css'

export default function ContactUs() {
  const valueArray = [
    { id: 1 },
    { id: 2 },
    { id: 3 }
  ]

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      <div className="cactus-dashboard-container">
        <div className="cactus-about_us-banner_top_view">
          <div className="cactus-about_us-banner_title_view">
            <h1>Contactez-nous</h1>
            <img src={aboutUsBorder} style={{ width: 320 }} />
            <h2>{'Acceuil -> Contactez-nous'}</h2>
          </div>
          <div className="cactus-about_us-banner_image_view">
            <img src={contactUsBanner} />
          </div>
        </div>
        <div className="cactus-contact_us-form_top_padding" />
        <ContactUsView style={{ backgroundColor: '#eaecec' }} />
        <div className="cactus-contact_us-form_bottom_padding" />
        <Footer />
      </div>
    </div >
  );
}
