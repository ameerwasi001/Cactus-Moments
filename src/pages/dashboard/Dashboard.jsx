import React from "react";
import { useNavigate } from "react-router-dom";
import { aboutUsImage, banner, dummyOne, dummyThree, dummyTwo } from "../../assets";
import { ContactUsView, Footer, NavBar, TempleteSliderView, TempleteView, } from "../../components";
import './dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const templeteArray = [
    {
      id: 1,
      image: dummyOne
    },
    {
      id: 2,
      image: dummyTwo

    },
    {
      id: 3,
      image: dummyThree

    },
    {
      id: 4,
      image: dummyOne

    },
    {
      id: 5,
      image: dummyThree

    },
    {
      id: 6,
      image: dummyOne

    },
    {
      id: 7,
      image: dummyThree

    },
    {
      id: 8,
      image: dummyTwo

    }
  ]

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      <div className="cactus-dashboard-container">
        <div className="cactus-dashboard-banner_top_view">
          <div className="cactus-dashboard-banner_text_view">
            <h5>Welcome to Cactus Moments</h5>
            <h1>
              Get your favorite Illustration template
            </h1>
            <h5>Lorem ipsum dolor sit amet consectetur. A diam elit pulvinar nunc condimentum donec. Ultricies dolor lacus gravida congue quam ultrices id lectus. Tempus luctus aenean massa velit duis phasellus .</h5>
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
            <img alt='' src={banner} />
          </div>
        </div>
        <TempleteSliderView title={'Popular Templates'} viewAll />
        <div className="cactus-dashboard-templete_top_view">
          {templeteArray.map((item) => {
            return (
              <TempleteView onClick={() => navigate('/templetedetail')} item={item} />
            )
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
            <h3>Cactus moment is a Customize able illustration providesof family trips, outing, couple trips etc</h3>
            <h4>Lorem ipsum dolor sit amet consectetur. Convallis nunc turpis consectetur purus felis et non. Blandit a sed cursus massa feugiat ut consectetur ornare diam. </h4>
            <div className="cactus-dashboard-contact_us_form_button_view" style={{ alignSelf: 'flex-start' }}>
              <h6 onClick={() => navigate('/aboutus')}>See More</h6>
            </div>
            <div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
