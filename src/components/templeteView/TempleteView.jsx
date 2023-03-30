import React from "react";
import { colorPicker } from "../../assets";
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
        <img alt="" src={item?.image} />
      </div>
      <div>
        <div className="cactus-dashboard-templete_title_view">
          <h2>{item?.name}</h2>
          <img alt="" src={colorPicker} />
        </div>
        <h3>{item?.desc}</h3>
        <h4>{item?.price}</h4>
      </div>
    </div>
  );
}
