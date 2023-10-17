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
        <div className="cactus-dashboard-templete_title_view">
          <h2>{item?.name}</h2>
          <img alt="" src={logo} />
        </div>
        <h3>{item?.desc}</h3>
        <p>{item?.posterDesc}</p>
        <h4>{item?.price}</h4>
      </div>
    </div>
  );
}
