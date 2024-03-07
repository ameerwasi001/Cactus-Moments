import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  arrowDown,
  dummyOne,
  dummyThree,
  dummyTwo,
  search,
} from "../../assets";
import { Footer, NavBar, TempleteSliderView, TempleteView } from "../../components";
import "./searchPage.css";
import useProduct from "../dashboard/useProduct";
import { ClipLoader } from "react-spinners";

const searchIcon = search

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState('')
  const {
    search,
    filteredProducts: templateArray,
    loadedProducts,
    productLoading,
    emitter,
    state,
    redirect,
    loading,
    setLoading,
    selectedCategory,
    setSelectedCategory,
  } = useProduct()

  const inputRef = useRef()

  return (
    <div className="cactus-search-main_container">
      <NavBar />
      <div className="cactus-search-container">
        <div className="cactus-search-banner_top_view" />
        <div className="cactus-search-banner_view">
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div onClick={() => inputRef?.click()} className="cactus-search-search_view">
              <img src={searchIcon} className="cactus-search-search_icon" />
              <input ref={inputRef} onChange={ev => setSearchData(ev.target.value)} value={searchData} placeholder="Recherche" />
            </div>
          </div>
        </div>
        <TempleteSliderView title={"Nos illustrations"} viewAll setSelectedCategory={x => {
          setSelectedCategory(x)
          setSearchData("")
          navigate(`?category=${x}`)
        }}/>
        {loading || productLoading ? <div style={{ width: '100vw', background: 'white', display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
          <ClipLoader color="black" />
        </div> : <div className="cactus-dashboard-templete_top_view">
          {templateArray.filter(p => p?.mainDesc?.includes(searchData)).map((item) => {
            return (
              <TempleteView
                onClick={async () => {                                                                                                                                                                                                   
                  setLoading(true)
                  const el = document.getElementById("main-products")
                  el?.scrollIntoView()

                  const onProductLoaded = product => {
                    console.log("Loaded, naviating")
                    setLoading(false)
                    navigate(`/templetedetail?title=${product?.mainDesc}&productCategry=${product?.productCategry}`, { state: { product: JSON.stringify(product) } })
                  }

                  const product = loadedProducts[item._id]

                  if(product) onProductLoaded(product) 
                  else emitter.on(item._id, onProductLoaded)
                }}
                item={item}
              />
            );
          })}
        </div>}
        <Footer />
      </div>
    </div>
  );
}
