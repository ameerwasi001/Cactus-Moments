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
        <p>{item?.posterDesc}</p>
        <div className="cactus-dashboard-templete_title_view">
          <h2>{item?.mainDesc}</h2>
          <img alt="" src={logo} />
        </div>
        <h3>{item?.desc}</h3>
        {console.log("UENTER", item)}
        <h4>{(parseInt(item?.price ?? "0")) + parseInt(item?.a3Price ?? "0") + parseInt(item?.frame1Price ?? "0")} €</h4>
      </div>
    </div>
  );
}
