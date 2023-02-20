import React from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { Footer, NavBar, } from "../../components";
// import { activeTab } from "../../redux/activeTabSlice";
import './dashboard.css'

export default function Dashboard() {
  // const navigate = useNavigate()
  // const disPatch = useDispatch();




  return (
    <div className="cactus-home_page-main_container">
      <NavBar />
      <div className="cactus-home_page-container">


        <Footer />

      </div>
    </div>
  );
}
