import React from "react";
import { useNavigate } from "react-router-dom";
import { aboutUsBanner, aboutUsBorder, dummyOne, dummyThree, dummyTwo, posterBanner } from "../../assets";
import { Footer, NavBar, TempleteSliderView, TempleteView, } from "../../components";
import './poster.css'

export default function Poster() {
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
        <div className="cactus-about_us-banner_top_view">
          <div className="cactus-about_us-banner_title_view">
            <h1>Poster</h1>
            <img src={aboutUsBorder} style={{ width: 180 }} />
            <h2>{'Home > Poster'}</h2>
          </div>
          <div className="cactus-about_us-banner_image_view">
            <img src={posterBanner} />
          </div>
        </div>
        <TempleteSliderView style={{ justifyContent: 'center' }} title={'what we sell'} />
        <div className="cactus-dashboard-templete_top_view">
          {templeteArray.map((item) => {
            return (
              <TempleteView onClick={() => navigate('/templetedetail')} item={item} />
            )
          })}
        </div>
        <Footer />
      </div>
    </div >
  );
}
