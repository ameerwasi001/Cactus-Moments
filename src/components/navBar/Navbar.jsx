import React, { useEffect, useState } from "react";
import "./navbar.css";
import close from "../../assets/close.png";
import menu from "../../assets/menu.png";
import { logo, search } from "../../assets";
import { PaymentModel, DetailModal } from "../../components";
import { setParam } from '../../urlParams'
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getKey, req, setKey } from '../../requests'

const crossImg = "https://cdn-icons-png.flaticon.com/512/57/57165.png"

const Navbar = (props) => {
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [templateArray, setTemplateArray] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showPaymentModel, setShowPaymentModel] = useState(null)
  const [withCard, setWithCard] = useState(false)
  const [detailModal, setDetailModal] = useState(null)

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
      {showPaymentModel || detailModal ? (
        detailModal ? <DetailModal
          autoSelect={true}
          containerStyle={{ padding: 'unset', paddingTop: '1rem', margin: 'unset', height: '100vh', width: '100vw' }}
          additionalData={detailModal}
          ogProduct={{}}
          product={{}}
          closeModal={() => setDetailModal(null)}
          hasStaticPositions={true}
          onClick={selectedCardPayment => {
            console.log("HERE, NAV")
            setWithCard(selectedCardPayment)
            setDetailModal(null)
            navigate('/billingAddress', {
              state: {
                selections: { withCard: selectedCardPayment }
              }
            })
          }}
          /> : <PaymentModel
          autoSelect={true}
          containerStyle={{ padding: 'unset', paddingTop: '1rem', margin: 'unset', height: '100vh', width: '100vw' }}
          additionalData={showPaymentModel}
          ogProduct={{}}
          product={{}}
          hasStaticPositions={true}
          onClick={optionId => {
            const selectedCardPayment = optionId != 3
            const showBillingScreenForCard = optionId == 1
            const minorBilling = optionId == 2
            console.log("HERE, NAV  props", optionId, showBillingScreenForCard, selectedCardPayment)
            setWithCard(selectedCardPayment)
            setShowPaymentModel(null)
            navigate('/billingAddress', {
              state: {
                selections: {
                  withCard: selectedCardPayment,
                  showBillingScreenForCard,
                  minorBilling,
                }
              }
            })
          }}
        />
      ) : <>
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
              // document?.getElementById("main-templates")?.scrollIntoView()
              // setOpenDropdown(openDropdown?.title == "poster" ? null : { title: "poster", data: templateArray })
              navigate("/?category=poster")
            }}
            style={{
              borderBottomStyle:
                openDropdown?.title == "poster" 
                  ? "solid"
                  : "none",
            }}
          >
            Posters
          </h1>
          {/* <DropDown title="poster" list={openDropdown} onClick={props.onProductClick ? (od => props.onProductClick(od, setLoading)) : async (od) => {
            setLoading(true)
            const { product } = await req("GET", `/user/product/${od._id}`)
            setLoading(false)
            navigate(`/templetedetail?${setParam({"product": JSON.stringify(product)})}`)
          }}/> */}
        </div>
        <div className="cactus__navbar-links_text_view">
          <h1
            onClick={() => {
              setOpenDropdown(openDropdown?.title == "accessories" ? null : { title: "accessories", data: ["Tasses", "Sacs"].map(mainDesc => ({ mainDesc })) })
            }}
            style={{
              borderBottomStyle:
                openDropdown?.title == "accessories"
                  ? "solid"
                  : "none",
            }}
          >
            Accessoires
          </h1>
          <DropDown title="accessories" list={openDropdown} onClick={item => {
            const category = item.mainDesc
            console.log("HERE, NAV ITEM", )
            // setWithCard(selectedCardPayment)
            // setShowPaymentModel(null)
            setOpenDropdown(null)
            navigate(`/?category=${category?.slice(0, -1)}`)
          }}/>
        </div>
        {/* <div className="cactus__navbar-links_text_view">
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
        <div className="cactus__navbar-links_text_view">
          <h1
            onClick={() => {
              setOpenDropdown(openDropdown?.title == "cart" ? null : { title: "cart", data: [...(getKey("cart") ?? []), (getKey("cart") ?? {}).length ? "check" : "nodata"].map(
                (p, i) => p == "check" ? <div className="cart-item">
                  <div></div>
                  <div className="cart-checkout-button" onClick={() => {
                    setShowPaymentModel(true)
                  }}>Voir panier</div>
                </div> : p == "nodata" ? <div className="cart-item-none">There's nothing in your cart</div> : <div className="cart-item">
                  <p onClick={() => {
                    setDetailModal(p)
                  }}>{p?.selections?.product?.mainDesc} et €{Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a+b, 0)}</p>
                  <img src={crossImg} className="cart-item-cross" onClick={ev => {
                    ev.stopPropagation()
                    const data = openDropdown?.data?.filter(x => x.mainDesc != p?.selections?.product?.mainDesc)
                    const cart = (getKey("cart") ?? []).filter((_, j) => j != i)
                    // delete cart[p?.selections?.product?._id]
                    setKey("cart", cart)
                    console.log("opendrop", cart)
                    setOpenDropdown(openDropdown => ({
                      // title: "cart",
                      ...(openDropdown ?? {}),
                      data
                    }))
                  }}/>
                </div>
              ).map(mainDesc => ({ mainDesc })) })
            }}
            style={{
              borderBottomStyle:
                openDropdown?.title == "cart"
                  ? "solid"
                  : "none",
            }}
          >
            Panier
          </h1>
          <DropDown title="cart" list={openDropdown}/>
        </div>
        <div
          onClick={() => navigate("/searchpage")}
          className="cactus__navbar-links_input_view"
        >
          <input disabled placeholder="Search" />
          <img alt="" src={search} />
        </div>
      </>}
    </>
  );

  return showPaymentModel || detailModal ? <Menu/> : (
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
