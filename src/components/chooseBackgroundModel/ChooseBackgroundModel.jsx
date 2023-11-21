import React, { useState } from 'react'
import { closeBox, onlyBg } from '../../assets'
import './chooseBackgroundModel.css'

export default function ChooseBackgroundModel(props) {
    const [selectedBg, setSelectedBg] = useState({ id: 0 })
    const dataArray = props.backgrounds.map((x, id) => { return {image: x, id: id+1} })
    console.log("Data Array =>", dataArray)

    return (
        <div className="cactus-choose_bg-model_top_view">
            <div className='cactus-choose_bg_model_view'>
                <div className='cactus-composition_model_header_view'>
                    <h2></h2>
                    <h1>Choose Background</h1>
                    <img onClick={props.onClick} src={closeBox} />
                </div>
                <div className='cactus-choose_bg_model-images_top_view'>
                    {dataArray.map((item) => {
                        return (
                            <div style={{ borderWidth: selectedBg.id === item.id ? 2 : 0, }} className='cactus-choose_bg_model-images_view' onClick={() => setSelectedBg(item)} key={item.id}>
                                <img src={item.image.url} />
                            </div>
                        )
                    })}
                </div>
                <div onClick={() => props.onClick(selectedBg)} className='cactus-composition_model_button_view'>
                    <h3>Choisir</h3>
                </div>
            </div>
        </div >
    )
}

