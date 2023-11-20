import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import './genderModel.css'

const dimensions = el => [el.getBoundingClientRect().width, el.getBoundingClientRect().heigth]
const rem = x => x * parseFloat(getComputedStyle(document.documentElement).fontSize);

const hasChildren = (cat, genderArray) => !!genderArray.find(xcat => {console.log("xcc", xcat, cat.title); return xcat.parent == cat.title})

export default function GenderModel(props) {
    const [selectedGender, setSelectedGender] = useState({ id: 0 })
    const [selectedParent, setSelectedParent] = useState("none")
    const [everSelects, setEverSelects] = useState(false)
    const [selectedData, setSelectedData] = useState({ id: -1, index: props.index })
    const [genderArray, setGenderArray] = useState(props.variation.map(({id, ...obj}) => { return {id: id+1, ...obj} }))
    console.log("EMPTer >>>>>", props, genderArray)

    useEffect(() => console.log(selectedGender, genderArray), [selectedGender])
    useEffect(() => console.log("PARENT SELECTED =>>", selectedParent), [selectedParent])

    useEffect(() => {
        for(const el of [...document.getElementsByClassName("character-box")]) {
            const [w, h] = dimensions(el)
            
        }
    }, [])

    console.log("GARRAY", genderArray)
    return (
        <div className="cactus-gender-model_top_view">
            <div className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view'>
                    {genderArray.filter(cat => cat.parent == selectedParent || !cat.parent).map((item) => {
                        return (
                            <div key={item.id} onClick={() => {
                                console.log("cbox", item.id, selectedGender.id, selectedParent, item?.title)
                                if(item.id == selectedGender.id) {
                                    setEverSelects(false)
                                    // setSelectedData({ index: -1, index: props.index })
                                    setSelectedGender({ id: 0 })
                                    setSelectedParent("none")
                                    return
                                }
                                if(!item.parent)setSelectedParent(item.title)
                                setSelectedGender(item)
                                setEverSelects(true)
                            }} style={{ borderWidth: item.id === selectedGender.id ? 2 : 0, marginLeft: item.parent ? '4rem' : '0px' }} className='cactus-gender_model_side_gender_view'>
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
                        {selectedGender.id === 0 || (!selectedGender.parent && hasChildren(selectedGender, genderArray)) ?
                            <h1>Select a theme to Display Design</h1>
                            :
                            <div className='cactus-gender_model_detail_images_view'>
                                {selectedGender.array.map((item) => {
                                    return (
                                        <div className='character-box' onClick={() => setSelectedData(item)} style={{ borderWidth: selectedData.id === item.id ? 2 : 0 }} key={item.id}>
                                            <img src={item.image}/>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>
                    <div onClick={() => props.onClick(selectedData, everSelects)} style={{ position: 'fixed', bottom: 0, width: '64%', display: 'flex', justifyContent: 'center', background: 'white' }}>
                        <div className='cactus-composition_model_button_view'>
                            <h3>Select</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

