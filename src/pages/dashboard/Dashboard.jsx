import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  aboutUsImage,
  banner,
  dummyOne,
  dummyThree,
  dummyTwo,
  filtersIcon,
  homeImage2,
  homeImage2Responsive,
  productCheckboxChecked,
  productCheckboxUnchecked,
  shape,
} from "../../assets";
import {
  ContactUsView,
  Footer,
  NavBar,
  TempleteSliderView,
  TempleteView,
} from "../../components";
import { getKey, req } from '../../requests'
import { setParam } from '../../urlParams'
import "./dashboard.css";
import { ClipLoader } from "react-spinners";
import EventEmitter from 'events'
import { Slide } from 'react-slideshow-image';
import { getDistribution, getInitialCategoryCharacters } from "../templeteDetail/TempleteDetail";
import useProduct from "./useProduct";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const isPhone = () => getWindowDimensions().width < 440

function paginate(array, page_size, page_number) {
  if (isPhone()) return array.slice((page_number - 1) * page_size, page_number * page_size);
  else return array
}

const SlideShow = (props) => <Slide duration={1000} nextArrow={<button style={{
  _: console.log("prooops", props),
  background: 'none',
  border: '0px',
  width: '30px'
}}></button>} prevArrow={<button style={{
  background: 'none',
  border: '0px',
  width: '30px'
}}></button>}>
    {props.images.map(url => <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', background: 'black' }}>
      <img src={url} style={{ maxWidth: '50vw', minWidth: '30vw' }}/>
    </div>)}
</Slide>

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    state,
    search,
    emitter,
    loading,
    redirect,
    setLoading,
    templeteArray,
    loadedProducts,
    productLoading,
    setSelectedCategory,
    selectedCategory,
    categories,
    selectedCategories,
    setSelectedCategories,
    filteredProducts,
    setMin,
    setMax,
    min,
    max,
    searchData,
    setSearchData,
  } = useProduct(window.location.href.split('?search=')[1])
  const [currPage, setCurrPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [lastClick, setLastClick] = useState(Date.now())
  const [slideShow, setSlideShow] = useState(false)
  const recordsPerPage = 20

  const timeout = useRef(null)

  useEffect(() => {
    const vendor = JSON.parse(getKey('vendor') ?? null)
    if (vendor?.name) navigate(`/${vendor?.name}`)
  }, [])

  const timoutFunction = () => {
    setSlideShow(true)
  }

  useEffect(() => {
    timeout.current = setTimeout(timoutFunction, 3*60*1000);
    return () => clearInterval(timeout.current)
  }, [])

  document.onclick = () => {
    clearTimeout(timeout.current)
    setTimeout(timoutFunction, 3*60*1000);
    setSlideShow(false)
  }

  if(slideShow) return <div className="cactus-dashboard-main_container" style={{ background: 'black' }}>
    <SlideShow images={filteredProducts?.map(x => x?.image?.url)}/>
  </div>

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar setSearchData={setSearchData}/>
      <div className="cactus-dashboard-container">
        <div className="cactus-dashboard-banner_top_view">
          <div className="cactus-dashboard-banner_text_view">
            {/* <h5>Welcome to Cactus Moments</h5> */}
            <h1 id="top">
              Personnalisez votre illustration {" "}
              <span style={{ color: "#2B453E" }}>préférée</span> !
            </h1>
            <h5>
              Trouvez des idées cadeaux pour toutes les occasions avec notre gamme de posters, tasses, sacs et d’autres accessoires, tous personnalisables.
            </h5>
            {/* {isPhone() ? <div style={{ marginTop: "2rem" }}></div> : <div className="cactus-dashboard-banner_buttons_view">
              <div className="cactus-dashboard-banner_see_more_view" onClick={() => document.getElementById("main-templates")?.scrollIntoView()}>
                <h2>Voir plus</h2>
              </div>
            </div>} */}
            {/* {!isPhone() && <div className="cactus-dashboard-banner_counter_top_view" style={{ marginTop: '30px' }}>
              <div className="cactus-dasboard-banner_counter_view">
                <h4>30+</h4>
                <h6>affiches</h6>
              </div>
              <div className="cactus-dasboard-banner_counter_view">
                <h4>70+</h4>
                <h6>idées cadeaux</h6>
              </div>
            </div>} */}
          </div>
          <div className="cactus-dashboard-banner_image_view">
            <img alt="" src={isPhone() ? homeImage2Responsive : homeImage2} />
          </div>
        </div>
        <TempleteSliderView isPhone={isPhone()} title={""} setFiltersOpen={setFiltersOpen} filtersOpen={filtersOpen} searchData={searchData} setSearchData={setSearchData} viewAll setSelectedCategory={(x, opts) => {
          setSelectedCategory(x)
          if(opts?.navigate) navigate(`?category=${x}`)
        }} />
        <div className="cactus-prouct-container">
          {((filtersOpen && isPhone()) || !isPhone()) && <div className="cactus-prouct-main-container">
            <p>Nombre de personnages</p>
            <div className="cactus-product-min-max-container">
              <input type="number" placeholder="0 - 12" max={12} min={0} value={max} onChange={ev => setMax(ev.target.value)} />
              {!isPhone() && <>
                <p>Recherche par thème</p>
                <input id='search-input' type="text" placeholder="Mots-clés" value={searchData} onChange={ev => setSearchData(ev.target.value)} />
              </>}
            </div>
            <div className="cactus-category-container">
              {categories.map(item => <div className="cactus-product-category">
                <img onClick={() => selectedCategories.has(item) ? setSelectedCategories(new Set([...selectedCategories].filter(x => x != item))) : setSelectedCategories(new Set([...selectedCategories, item]))} src={selectedCategories.has(item) ? productCheckboxChecked : productCheckboxUnchecked} />
                <p>{item}</p>
                <p></p>
              </div>)}
            </div>
          </div>}
          <div id="main-products" className="cactus-dashboard-templete_top_view">
            {console.log(min, max)}
            {loading || productLoading ? <ClipLoader color="black" /> : paginate(filteredProducts.filter(p => !p.hidden), recordsPerPage, currPage).map((item) => {
              return (
                <TempleteView
                  isPhone={isPhone()}
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

                    if (product) onProductLoaded(product)
                    else emitter.on(item._id, onProductLoaded)
                  }}
                  item={item}
                />
              )
            })}
          </div>
        </div>
        <div>
          {
            isPhone() && <div className="template-pagination">
              {
                new Array(Math.ceil(templeteArray.filter(p => p.productCategry.toLowerCase() == selectedCategory.toLowerCase()).length / recordsPerPage))
                  .fill(0)
                  .map((_, i) => <p onClick={() => {
                    setCurrPage(i + 1)
                    document.getElementById("main-products")?.scrollIntoView()
                  }} style={{ color: currPage == i + 1 ? "grey" : "blue", cursor: currPage == i + 1 ? "default" : "pointer" }}>{i + 1}</p>)
              }
            </div>
          }
        </div>
        {/* <ContactUsView fullName={name} setFullName={setName} setEmail={setEmail} email={email} message={message} setMessage={setMessage} onClick={() => alert("Hi!")}/> */}
        <div className="cactus-dashboard-about_us_top_view">
          <div className="cactus-dashboard-about_us_main_image">
            <img src={aboutUsImage} />
          </div>

          <div className="cactus-dashboard-about_us_detail_view">
            <h2>À propos de nous</h2>
            <h1>Cactus Moments</h1>
            {/* <h3>
              Cactus moment is a Customize able illustration providesof family
              trips, outing, couple trips etc
            </h3> */}
            <h4>
              Nous sommes Robin et Ann, le duo derrière Cactus Moments. Passionnés par le sport et la création artistique, nous sommes dévoués à transformer vos moments sportifs, familiaux et entre amis en souvenirs personnalisés.{" "}
            </h4>
            <div className="cactus-dashboard-contact_us_form_button_view-container">
              {/* <div
                className="cactus-dashboard-contact_us_form_button_view"
                style={{ alignSelf: "flex-start" }}
              >
                <h6 onClick={() => navigate("/aboutus")}>See More</h6>
              </div> */}
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
