import React from "react";
import { colorPicker, logo } from "../../assets";
import "./templeteView.css";

export default function TempleteView(props) {
  const { item } = props;
  return (
    <div
      onClick={props.onClick}
      key={item?.id}
      className="cactus-dashboard-templete_view"
    >
      <div className="cactus-dashboard-templete_image_view">
        <img alt="" src={item?.image?.url} />
      </div>
      <div>
        {/* <p>{item?.posterDesc}</p> */}
        <div className="cactus-dashboard-templete_title_view">
          {!props.isPhone && <div style={{ width: "3rem", height: "3rem" }}></div>}
          <h2>{item?.mainDesc}</h2>
          {!props.isPhone && <img alt="" src={logo} />}
        </div>
        <h3>{item?.desc}</h3>
        <h4>{((parseFloat(item?.price ?? "0"))).toFixed(2)} €</h4>
      </div>
    </div>
  );
}
