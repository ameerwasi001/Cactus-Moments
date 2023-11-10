import React, { useEffect, useState } from "react";
import "./navbar.css";
import close from "../../assets/close.png";
import menu from "../../assets/menu.png";
import { logo, search } from "../../assets";
import { setParam } from '../../urlParams'
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { req } from '../../requests'

const Navbar = (props) => {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [templateArray, setTemplateArray] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    req('GET', `/user/product?select=-categories`)
      .then(({products}) => {
        setLoading(false)
        setTemplateArray(products?.filter(prod => prod.backgrounds.length)?.filter(prod => prod.name)?.map((p, id) => { return {...p, id, image: p.defaultIllustration ? {url: p.defaultIllustration} : p.backgrounds[p.defaultBackground]} }))
      })
  }, [])

  const DropDown = ({ title, list: openDropdown, onClick }) => {
    return <div className="navbar-dropdown-container">
      {openDropdown?.title == title && <div className="navbar-dropdown">
        {loading ? <ClipLoader color="black" /> : openDropdown?.data?.map(od => <p className={onClick ? "" : "important-font-weight"} style={{ cursor: onClick ? "pointer" : "default" }} onClick={() => onClick ? onClick(od) : null}>{od.mainDesc}</p>)}
      </div>}
    </div>
  }

  const Menu = () => (
    <>
      <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => navigate("/")}
          style={{
            borderBottomStyle:
              window.location.pathname === "/"
                ? "solid"
                : "none",
          }}
        >
          Home
        </h1>
      </div>
      <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => {
            setOpenDropdown(openDropdown?.title == "poster" ? null : { title: "poster", data: templateArray })
            // navigate("/poster")
          }}
          style={{
            borderBottomStyle:
              openDropdown?.title == "poster" 
                ? "solid"
                : "none",
          }}
        >
          Poster
        </h1>
        <DropDown title="poster" list={openDropdown} onClick={props.onProductClick ? (od => props.onProductClick(od, setLoading)) : async (od) => {
          setLoading(true)
          const { product } = await req("GET", `/user/product/${od._id}`)
          setLoading(false)
          navigate(`/templetedetail?${setParam({"product": JSON.stringify(product)})}`)
        }}/>
      </div>
      <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => {
            setOpenDropdown(openDropdown?.title == "accessories" ? null : { title: "accessories", data: ["Tasse", "Gourde", "Sac"].map(mainDesc => ({ mainDesc })) })
          }}
          style={{
            borderBottomStyle:
              openDropdown?.title == "accessories"
                ? "solid"
                : "none",
          }}
        >
          Accessories
        </h1>
        <DropDown title="accessories" list={openDropdown}/>
      </div>
      <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => {
            setOpenDropdown(openDropdown?.title == "giftIdea" ? null : { title: "giftIdea", data: ["Anniversaire", "Fête des mères", "Fêtes des pères", "EGV", "Enfant"].map(mainDesc => ({ mainDesc })) })
          }}
          style={{
            borderBottomStyle:
              openDropdown?.title == "giftIdea"
                ? "solid"
                : "none",
          }}
        >
          Gift Idea
        </h1>
        <DropDown title="giftIdea" list={openDropdown}/>
      </div>
      {/* <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => navigate("/aboutus")}
          style={{
            borderBottomStyle:
              window.location.href === "http://localhost:3000/aboutus"
                ? "solid"
                : "none",
          }}
        >
          About us
        </h1>
      </div> */}
      <div className="cactus__navbar-links_text_view">
        <h1
          onClick={() => navigate("/contactus")}
          style={{
            borderBottomStyle:
              window.location.href === "http://localhost:3000/contactus"
                ? "solid"
                : "none",
          }}
        >
          Contact
        </h1>
      </div>
      <div
        onClick={() => navigate("/searchpage")}
        className="cactus__navbar-links_input_view"
      >
        <input disabled placeholder="Search" />
        <img alt="" src={search} />
      </div>
    </>
  );

  return (
    <div className="cactus__navbar">
      <div className="cactus__navbar-links_logo">
        <img src={logo} alt="Logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}/>
        <p style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Cactus Moments</p>
      </div>
      <div className="cactus__navbar-links">
        <div className="cactus_navbar-links_container">
          <Menu />
        </div>
      </div>
      <div className="cactus__navbar-menu">
        {toggleMenu ? (
          <img
            alt="Close"
            onClick={() => setToggleMenu(!toggleMenu)}
            src={close}
            className="cactus__navbar_closeIcon"
          />
        ) : (
          <img
            alt="Menu"
            onClick={() => setToggleMenu(!toggleMenu)}
            src={menu}
            className="cactus__navbar_menuIcon"
          />
        )}
        {toggleMenu && (
          <div className="cactus__navbar-menu_container scale-up-center">
            <div className="cactus__navbar-menu_container_links">
              <Menu />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
