import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  aboutUsImage,
  banner,
  dummyOne,
  dummyThree,
  dummyTwo,
  homeImage2,
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
import { ClipLoader } from "react-spinners";

const getS3Url = id => `https://drivebuddyz.s3.us-east-2.amazonaws.com/${id}.json?${1000+Math.random()*1000}`
const fetchObejct = id => fetch(getS3Url(id)).then(res => res.text()).then(x => JSON.parse(decodeURIComponent(x)))

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const isPhone = () => getWindowDimensions().width < 421  

function paginate(array, page_size, page_number) {
  if(isPhone()) return array.slice((page_number - 1) * page_size, page_number * page_size);
  else return array
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [templeteArray, setTemplateArray] = useState([]);
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("poster")
  const [currPage, setCurrPage] = useState(1)
  const recordsPerPage = 10
  const { search } = useLocation()

  console.log("PRODID", search)

  useEffect(() => {
    const f = async () => {
      const productId = search?.split("productId=")?.[1]
      const categoryName = search?.split("category=")?.[1]
      if(productId) {
        const el = document.getElementById("main-products")
        el?.scrollIntoView()
        setLoading(true)
        const { product } = await req("GET", `/user/product/${productId}`)
        setLoading(false)
        navigate(`/templetedetail?${setParam({"product": JSON.stringify(product)})}`)
      } else if(categoryName) {
        setSelectedCategory(categoryName)
        document?.getElementById("main-templates")?.scrollIntoView()
      }
    }
    f()
  }, [search])

  useEffect(() => {
    req('GET', `/user/product?select=${encodeURIComponent("_id name productCategry mainDesc defaultIllustration backgrounds price")}`)
      .then(({products}) => {
        console.log(products)
        console.log("setting")
        const mappedProducts = products?.filter(prod => prod.backgrounds.length)?.filter(prod => prod.name)?.map((p, id) => { return {...p, id, image: p.defaultIllustration ? {url: p.defaultIllustration} : p.backgrounds[p.defaultBackground]} })
        setTemplateArray(mappedProducts)
        console.log("done setting", mappedProducts)
        setLoading(false)
      })
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    if(templeteArray?.length) setLoading(false)
  }, [templeteArray])

  return (
    <div className="cactus-dashboard-main_container">
      <NavBar />
      <div className="cactus-dashboard-container">
        <div className="cactus-dashboard-banner_top_view">
          <div className="cactus-dashboard-banner_text_view">
            {/* <h5>Welcome to Cactus Moments</h5> */}
            <h1>
            Choisissez et personnalisez votre{" "}
              <span style={{ color: "#2B453E" }}>illustration</span> !
            </h1>
            <h5>
            Trouvez des idées cadeaux pour toutes les occasions avec notre gamme de posters, tasses, sacs et d’autres accessoires, tous personnalisables.
            </h5>
            {isPhone() ? <div style={{ marginTop: "2rem" }}></div> : <div className="cactus-dashboard-banner_buttons_view">
              <div className="cactus-dashboard-banner_see_more_view" onClick={() => document.getElementById("main-templates")?.scrollIntoView()}>
                <h2>Voir plus</h2>
              </div>
              {/* <div className="cactus-dashboard-banner_contact_button">
                <h3>Contact Us</h3>
              </div> */}
            </div>}
            {!isPhone() && <div className="cactus-dashboard-banner_counter_top_view">
              <div className="cactus-dasboard-banner_counter_view">
                <h4>30+</h4>
                <h6>affiches</h6>
              </div>
              <div className="cactus-dasboard-banner_counter_view">
                <h4>70+</h4>
                <h6>idées cadeaux</h6>
              </div>
            </div>}
          </div>
          <div className="cactus-dashboard-banner_image_view">
            <img alt="" src={homeImage2} />
          </div>
        </div>
        <TempleteSliderView title={"Popular Templates"} viewAll setSelectedCategory={x => {
          setSelectedCategory(x)
          navigate(`/?category=${x}`)
        }}/>
        <div id="main-products" className="cactus-dashboard-templete_top_view">
          {loading ? <ClipLoader color="black" /> : paginate(templeteArray.filter(p => p.productCategry.toLowerCase() == selectedCategory.toLowerCase()), recordsPerPage, currPage).map((item) => {
              return (
                <TempleteView
                  onClick={async () => {
                    setLoading(true)
                    const el = document.getElementById("main-products")
                    el?.scrollIntoView()
                    const product = await fetchObejct(item._id)
                    setLoading(false)
                    navigate(`/templetedetail?${setParam({"product": JSON.stringify(product)})}`)
                  }}
                  item={item}
                />
              );
          })}
        </div>
        <div>
          {
            isPhone() && <div className="template-pagination">
              {
                new Array(Math.ceil(templeteArray.filter(p => p.productCategry.toLowerCase() == selectedCategory.toLowerCase()).length/recordsPerPage))
                  .fill(0)
                  .map((_, i) => <p onClick={() => {
                    setCurrPage(i+1)
                    document.getElementById("main-products")?.scrollIntoView()
                  }} style={{ color: currPage == i+1? "grey" : "blue", cursor: currPage == i+1? "default" : "pointer" }}>{i+1}</p>)
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
