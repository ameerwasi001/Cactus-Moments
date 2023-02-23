import React from 'react'
import { arrowDown } from '../../assets'
import './dropdownModel.css'

export default function DropdowModel(props) {
    return (
        <div className="cactus-templete_detail-frame_dropdown_top_view">
            <div className="cactus-templete_detail-frame_dropdown_view">
                <h4>{props?.name}</h4>
                <img onClick={props.onClick} src={arrowDown} />
            </div>
            {props.dropdownValue &&
                <div className="cactus-templete_detail-frame_dropdown_main_view">
                    {props.array?.map((item) => {
                        return (
                            <h4 onClick={() => props.onClickValue(item)} key={item.id}>{item.name}</h4>
                        )
                    })}
                </div>
            }

        </div>
    )
}
