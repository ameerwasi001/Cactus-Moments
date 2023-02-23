import React, { useState } from 'react'
import { closeBox, onlyBg } from '../../assets'
import './chooseBackgroundModel.css'

export default function ChooseBackgroundModel(props) {
    const [selectedBg, setSelectedBg] = useState({ id: 0 })
    const dataArray = [
        {
            id: 1,
        },
        {
            id: 2
        },
        {
            id: 3,
        },
        {
            id: 4,
        },
        {
            id: 5,
        },
        {
            id: 6
        },
        {
            id: 7,
        },
        {
            id: 8,
        },

    ]

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
                                <img src={onlyBg} />
                            </div>
                        )
                    })}
                </div>
                <div onClick={props.onClick} className='cactus-composition_model_button_view'>
                    <h3>Select</h3>
                </div>
            </div>
        </div >
    )
}

