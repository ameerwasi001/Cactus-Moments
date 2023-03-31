import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aboutUsBanner, aboutUsBorder, dummyOne, dummyThree, dummyTwo, posterBanner } from "../../assets";
import { Footer, NavBar, TempleteSliderView, TempleteView, } from "../../components";
import { req } from "../../requests";
import { setParam } from "../../urlParams";
import './poster.css'

export default function Poster() {
  const navigate = useNavigate()

  const [templeteArray, setTemplateArray] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    req('GET', '/user/product')
      .then(({products}) => {
        console.log(products)
        setTemplateArray(products?.map((p, id) => { return {...p, id, image: p.backgrounds[p.defaultBackground]} }))
      })
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [templeteArray])

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
        {loading ? <small>Loading...</small> : templeteArray.map((item) => {
            return (
              <TempleteView
                onClick={() => navigate(`/templetedetail?${setParam({"product": JSON.stringify(item)})}`)}
                item={item}
              />
            );
          })}
        </div>
        <Footer />
      </div>
    </div >
  );
}
