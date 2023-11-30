import React from "react";
import { aboutUsBanner, aboutUsBorder, dummyFive, dummyFour, heart } from "../../assets";
import { Footer, NavBar, TempleteSliderView, } from "../../components";
import './aboutUs.css'

export default function AboutUs() {
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
            <h1>About Us</h1>
            <img src={aboutUsBorder} />
            <h2>{'Acceuil > About Us'}</h2>
          </div>
          <div className="cactus-about_us-banner_image_view">
            <img src={aboutUsBanner} />
          </div>
        </div>
        <TempleteSliderView style={{ justifyContent: 'center' }} title={'what we sell'} />
        <div className="cactus-about_us-story_top_view">
          <div className="cactus-about_us-story_detail_view">
            <h1>Our Story</h1>
            <h2>Cactus moment is a Customize able illustration providesof family trips, outing, couple trips etc </h2>
            <h3>Maecenas suscipit vel sem vitae tristique. Fusce convallis ligula sed eros semper cursus. Praesent vel mollis mauris. Nunc non eros eget mauris finibus pretium in eget lacus. Maecenas vitae sodales ex, iaculis accumsan augue. Ut consectetur dui vel pellentesque sagittis. Vestibulum ut pharetra tellus.<br /><br /> Sed semper quis augue vitae efficitur. Praesent at laoreet tortor, ac dignissim risus. Integer gravida mollis feugiat. Nulla luctus est at arcu placerat condimentum. Ut eget viverra enim. Praesent in ligula eget nisi malesuada luctus.</h3>
        </div>
        <div className="cactus-about_us-story_image_view">
          <img src={dummyFive} />
        </div>
      </div>

      <div className="cactus-about_us-value_top_view">
        {valueArray.map((item) => {
          return (
            <div key={item.id} className="cactus-about_us-value_view">
              <div>
                <img src={heart} />
                <h2>Value 1</h2>
              </div>
              <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mollis a ante eget posuere. Lorem ipsum dolor sit amet.</h3>
            </div>
          )
        })}
      </div>
      <div className="cactus-about_us-mission_top_view">
        <div className="cactus-about_us-mission_image_view">
          <img src={dummyFour} />
        </div>
        <div className="cactus-about_us-story_detail_view">
          <h1>Our Mission</h1>
          <h2>Cactus moment is a Customize able illustration providesof family trips, outing, couple trips etc </h2>
          <h3>Maecenas suscipit vel sem vitae tristique. Fusce convallis ligula sed eros semper cursus. Praesent vel mollis mauris. Nunc non eros eget mauris finibus pretium in eget lacus. Maecenas vitae sodales ex, iaculis accumsan augue. Ut consectetur dui vel pellentesque sagittis. Vestibulum ut pharetra tellus.<br /><br /> Sed semper quis augue vitae efficitur. Praesent at laoreet tortor, ac dignissim risus. Integer gravida mollis feugiat. Nulla luctus est at arcu placerat condimentum. Ut eget viverra enim. Praesent in ligula eget nisi malesuada luctus.</h3>
        </div>
      </div>
      <Footer />
    </div>
    </div >
  );
}
