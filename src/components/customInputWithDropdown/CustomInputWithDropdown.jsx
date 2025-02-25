import React, { useRef } from 'react'
import { arrowDown, arrowDownTwo, arrowUp, edit, maleDummy, onlyBg } from '../../assets'
import { getSmallImage } from '../../requests'
import './customInputWithDropdown.css'

export default function CustomInputWithDropdown(props) {
    const title = useRef(null)
    const subtitle = useRef(null)


    return (
        <div className="cactus-templete_detail-form_dropdown_top_view" style={props.containerStyle}>
            <div onClick={props.onClickEditNameDropdown} style={{ cursor: 'pointer' }} className="cactus-templete_detail-form_dropdown_title_view">
                <h4 onClick={props.onClickEditNameDropdown} style={props.modalOpened ? {} : { zIndex: 1000000000000 }}>{props.value}</h4>
                <img onClick={props.onClickEditNameDropdown} src={props.dropdownValue ? arrowUp : arrowDownTwo} />
            </div>
            {props.dropdownValue &&
                (props.type === 'name' ?
                    <>
                        <h5>Titre</h5>
                        <div className="cactus-templete_detail-form_dropdown_title_icon_view">
                            <input placeholder="Enter title" ref={title} value={props.title} onChange={ev => props.onChangeTitle(ev.target.value)}/>
                            <img src={edit} onClick={() => title.current.focus()} />
                        </div>
                        <div className="cactus-templete_detail-form_dropdown_title_divider" />
                        <h5>Sous-titre</h5>
                        <div className="cactus-templete_detail-form_dropdown_title_icon_view">
                            <input ref={subtitle} placeholder="Enter sub title" value={props.subtitle} onChange={ev => props.onChangeSubtitle(ev.target.value)} />
                            <img src={edit} onClick={() => subtitle.current.focus()} />
                        </div>
                        <div className="cactus-templete_detail-form_dropdown_title_divider" />
                        <div style={{ height: 10 }} />
                    </>
                    :
                    <>
                        <div className="cactus-templete_detail-form_dropdown_background_data_view">
                            {props?.dropdownData?.image?.url || props?.dropdownData?.image ? <img src={
                                props.type === 'background' ? 
                                    getSmallImage(props.type === 'background' ? (props.dropdownData.image?.coordinateVariation?.alternate ? props.dropdownData.image?.coordinateVariation?.alternate : props.dropdownData.image.url) : props.dropdownData.image) : 
                                    (props.type === 'background' ? props.dropdownData.image.url : props.dropdownData.image)
                                } onClick={props.onClickButton} /> : <h3>Sélectionnez une image</h3>}
                            <div onClick={props.onClickButton}>
                                <h6>{props.type === 'background' ? 'Modifier l’arrière-plan' : props.type === 'adult' ? 'Modifier ' + props.categoryName : 'Modifier ' + props.categoryName}</h6>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}
