import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  aboutUsImage,
  banner,
  dummyOne,
  dummyThree,
  dummyTwo,
  shape,
} from "../../assets";
import {
  ContactUsView,
  Footer,
  NavBar,
  TempleteSliderView,
  TempleteView,
} from "../../components";
import { req } from '../../requests'
import { setParam } from '../../urlParams'
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [templeteArray, setTemplateArray] = useState([]);

  useEffect(() => {
    req('GET', '/user/product')
      .then(({products}) => {
        console.log(products)
        setTemplateArray(products?.map((p, id) => { return {...p, id, image: p.defaultBackground} }))
      })
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [templeteArray])

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      <div className="cactus-dashboard-container">
        <div className="cactus-dashboard-banner_top_view">
          <div className="cactus-dashboard-banner_text_view">
            <h5>Welcome to Cactus Moments</h5>
            <h1>
              Get your favorite{" "}
              <span style={{ color: "#2B453E" }}>Illustration</span> template
            </h1>
            <h5>
              Lorem ipsum dolor sit amet consectetur. A diam elit pulvinar nunc
              condimentum donec. Ultricies dolor lacus gravida congue quam
              ultrices id lectus. Tempus luctus aenean massa velit duis
              phasellus .
            </h5>
            <div className="cactus-dashboard-banner_buttons_view">
              <div className="cactus-dashboard-banner_see_more_view">
                <h2>See More</h2>
              </div>
              <div className="cactus-dashboard-banner_contact_button">
                <h3>Contact Us</h3>
              </div>
            </div>
            <div className="cactus-dashboard-banner_counter_top_view">
              <div className="cactus-dasboard-banner_counter_view">
                <h4>100+</h4>
                <h6>Templates</h6>
              </div>
              <div className="cactus-dasboard-banner_counter_view">
                <h4>1200+</h4>
                <h6>Happy Customers</h6>
              </div>
            </div>
          </div>
          <div className="cactus-dashboard-banner_image_view">
            <img alt="" src={banner} />
          </div>
        </div>
        <TempleteSliderView title={"Popular Templates"} viewAll />
        <div className="cactus-dashboard-templete_top_view">
        {loading ? <small>Loading...</small> : templeteArray.map((item) => {
            return (
              <TempleteView
                onClick={() => navigate(`/templetedetail?${setParam({"product": JSON.stringify(item)})}`)}
                item={item}
              />
            );
          })}
        </div>
        <ContactUsView />
        <div className="cactus-dashboard-about_us_top_view">
          <div className="cactus-dashboard-about_us_main_image">
            <img src={aboutUsImage} />
          </div>

          <div className="cactus-dashboard-about_us_detail_view">
            <h2>ABOUT US</h2>
            <h1>Cactus Moments</h1>
            <h3>
              Cactus moment is a Customize able illustration providesof family
              trips, outing, couple trips etc
            </h3>
            <h4>
              Lorem ipsum dolor sit amet consectetur. Convallis nunc turpis
              consectetur purus felis et non. Blandit a sed cursus massa feugiat
              ut consectetur ornare diam.{" "}
            </h4>
            <div className="cactus-dashboard-contact_us_form_button_view-container">
              <div
                className="cactus-dashboard-contact_us_form_button_view"
                style={{ alignSelf: "flex-start" }}
              >
                <h6 onClick={() => navigate("/aboutus")}>See More</h6>
              </div>
              <div className="cactus-dashboard-contact_us_form_button_view-shape">
                <img src={shape} alt="shape.png" />
              </div>
            </div>

            <div></div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
