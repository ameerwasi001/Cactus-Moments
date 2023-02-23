import React, { useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import './genderModel.css'

export default function GenderModel(props) {
    const [selectedGender, setSelectedGender] = useState({ id: 0 })
    const [selectedData, setSelectedData] = useState({ id: 0 })
    const genderArray = [
        {
            id: 1,
            title: 'Female',
            icon: female
        },
        {
            id: 2,
            title: 'Male',
            icon: male
        },

    ]
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

    ]

    return (
        <div className="cactus-gender-model_top_view">
            <div className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view'>
                    {genderArray.map((item) => {
                        return (
                            <div key={item.id} onClick={() => setSelectedGender(item)} style={{ borderWidth: item.id === selectedGender.id ? 2 : 0 }} className='cactus-gender_model_side_gender_view'>
                                <img src={item.icon} />
                                <h2>{item.title}</h2>
                            </div>
                        )
                    })}
                </div>
                <div className='cactus-gender_model_divider' />
                <div className='cactus-gender_model_detail_top_view'>
                    <div className='cactus-gender_model_detail_cross_image'>
                        <img onClick={props.onClick} src={closeBox} />
                    </div>
                    <div className='cactus-gender_model_detail_images_top_view'>
                        {selectedGender.id === 0 ?
                            <h1>Select a theme to Display Design</h1>
                            :
                            <div className='cactus-gender_model_detail_images_view'>
                                {dataArray.map((item) => {
                                    return (
                                        <div onClick={() => setSelectedData(item)} style={{ borderWidth: selectedData.id === item.id ? 2 : 0 }} key={item.id}>
                                            <img src={maleDummy} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                    <div onClick={props.onClick} className='cactus-composition_model_button_view' style={{ marginTop: -50 }}>
                        <h3>Select</h3>
                    </div>
                </div>
            </div>
        </div >
    )
}

