import React from "react";
import { useNavigate } from "react-router-dom";
import {
  arrowDown,
  dummyOne,
  dummyThree,
  dummyTwo,
  search,
} from "../../assets";
import { Footer, NavBar, TempleteView } from "../../components";
import "./searchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const templeteArray = [
    {
      id: 1,
      image: dummyOne,
      price: "35$",
    },
    {
      id: 2,
      image: dummyTwo,
      price: "35$",
    },
    {
      id: 3,
      image: dummyThree,
      price: "35$",
    },
    {
      id: 4,
      image: dummyOne,
      price: "35$",
    },
    {
      id: 5,
      image: dummyThree,
      price: "35$",
    },
    {
      id: 6,
      image: dummyOne,
      price: "35$",
    },
    {
      id: 7,
      image: dummyThree,
      price: "35$",
    },
    {
      id: 8,
      image: dummyTwo,
      price: "35$",
    },
  ];

  return (
    <div className="cactus-search-main_container">
      <NavBar />
      <div className="cactus-search-container">
        <div className="cactus-search-banner_top_view" />
        <div className="cactus-search-banner_view">
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div className="cactus-search-search_view">
              <img src={search} className={"cactus-search-search_icon"} />
              <input placeholder="Search" />
              <div className="cactus-search-min_divider_view" />
              <h3>Family Outing</h3>
              <img
                src={arrowDown}
                className={"cactus-search-arrow_down_icon"}
              />
            </div>
          </div>
        </div>
        <div className="cactus-search-title_view">
          <h2>Family Trip</h2>
        </div>
        <div className="cactus-dashboard-templete_top_view">
          {templeteArray.map((item) => {
            return (
              <TempleteView
                onClick={() => navigate("/templetedetail")}
                item={item}
              />
            );
          })}
        </div>
        <Footer />
      </div>
    </div>
  );
}
