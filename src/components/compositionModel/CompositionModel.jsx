import React, { useState } from 'react'
import { arrowDown, closeBox, dummyWithBg } from '../../assets'
import './compositionModel.css'

export default function CompositionModel(props) {
    const dataArray = [
        {
            id: 1,
            title: 'Number of adults',
            value: 2
        },
        {
            id: 2,
            title: 'Number of Babies',
            value: 2
        },
        {
            id: 3,
            title: 'Number of Children',
            value: 2
        },
        {
            id: 4,
            title: 'Number of Pet',
            value: 2
        },

    ]
    return (
        <div className="cactus-composition-model_top_view">
            <div className='cactus-composition_model_view'>
                <div className='cactus-composition_model_header_view'>
                    <h2></h2>
                    <h1>Composition of Family</h1>
                    <img onClick={props.onClick} src={closeBox} />
                </div>
                <div className='cactus-composition_model_main_image_view'>
                    <img src={dummyWithBg} />
                </div>
                <div className='cactus-composition_model_selection_top_view'>
                    <h2>Number of adults</h2>
                    <div>
                        <h3>2</h3>
                        <img src={arrowDown} />
                    </div>
                </div>
                {dataArray.map((item) => {
                    return (
                        <div key={item.id} className='cactus-composition_model_selection_top_view'>
                            <h2>{item.title}</h2>
                            <div>
                                <h3>{item.value}</h3>
                                <img src={arrowDown} />
                            </div>
                        </div>
                    )
                })}
                <div onClick={props.onClick} className='cactus-composition_model_button_view'>
                    <h3>Save</h3>
                </div>


            </div>
        </div >
    )
}

