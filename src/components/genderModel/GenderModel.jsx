import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import './genderModel.css'

export default function GenderModel(props) {
    const [selectedGender, setSelectedGender] = useState({ id: 0 })
    const [everSelects, setEverSelects] = useState(false)
    const [selectedData, setSelectedData] = useState({ id: -1 })
    const [genderArray, setGenderArray] = useState([
        {
            id: 1,
            title: 'Female',
            array: props.femaleVariations.map((x, id) => { return { image: x, id: id+1 } }),
            icon: female
        },
        {
            id: 2,
            title: 'Male',
            array: props.maleVariations.map((x, id) => { return { image: x, id: id+1 } }),
            icon: male
        },
    ])

    useEffect(() => console.log(selectedGender), selectedGender)

    return (
        <div className="cactus-gender-model_top_view">
            <div className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view'>
                    {genderArray.map((item) => {
                        return (
                            <div key={item.id} onClick={() => {
                                setSelectedGender(item)
                                setEverSelects(true)
                            }} style={{ borderWidth: item.id === selectedGender.id ? 2 : 0 }} className='cactus-gender_model_side_gender_view'>
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
                                {selectedGender.array.map((item) => {
                                    return (
                                        <div onClick={() => setSelectedData(item)} style={{ borderWidth: selectedData.id === item.id ? 2 : 0 }} key={item.id}>
                                            <img src={item.image} />
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                    <div onClick={() => props.onClick(selectedData, everSelects)} className='cactus-composition_model_button_view' style={{ marginTop: -50 }}>
                        <h3>Select</h3>
                    </div>
                </div>
            </div>
        </div >
    )
}

