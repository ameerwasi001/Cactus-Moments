import React from 'react'
import { arrowDown, arrowDownTwo, arrowUp, edit, maleDummy, onlyBg } from '../../assets'
import './customInputWithDropdown.css'

export default function CustomInputWithDropdown(props) {
    return (
        <div className="cactus-templete_detail-form_dropdown_top_view">
            <div className="cactus-templete_detail-form_dropdown_title_view">
                <h4>{props.value}</h4>
                <img onClick={props.onClickEditNameDropdown} src={props.dropdownValue ? arrowUp : arrowDownTwo} />
            </div>
            {props.dropdownValue &&
                (props.type === 'name' ?
                    <>
                        <h5>Title</h5>
                        <div className="cactus-templete_detail-form_dropdown_title_icon_view">
                            <input placeholder="Enter title" />
                            <img src={edit} />
                        </div>
                        <div className="cactus-templete_detail-form_dropdown_title_divider" />
                        <h5>Sub Title</h5>
                        <div className="cactus-templete_detail-form_dropdown_title_icon_view">
                            <input placeholder="Enter sub title" />
                            <img src={edit} />
                        </div>
                        <div className="cactus-templete_detail-form_dropdown_title_divider" />
                        <div style={{ height: 10 }} />
                    </>
                    :
                    <>
                        <div className="cactus-templete_detail-form_dropdown_background_data_view">
                            <img src={props.type === 'background' ? props.dropdownData.image : props.dropdownData.image} />
                            <div onClick={props.onClickButton}>
                                <h6>{props.type === 'background' ? 'Edit Background' : props.type === 'adult' ? 'Edit Adult' : 'Edit Child'}</h6>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}
