import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy, radioFilled, radio } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'
import { getKey } from '../../requests'

const { Option } = Select

const findPrice = p => Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a+b, 0)

const selectOptions = opts => {
    const obj = {}
    const objp = {}
    for(const order of opts) objp[order?.selections?.product?.mainDesc] = 0

    for(const order of opts) {
        obj[order?.selections?.product?.mainDesc] = (obj[order?.selections?.product?.mainDesc] ?? 0) + findPrice(order)
        objp[order?.selections?.product?.mainDesc] += 1
    }
    console.log(objp)
    return Object.entries(obj).map(([k, v]) => ({ question: `${k} x ${objp[k]}`, answer: `${v}€` }))
}

export default function DefaultModel(props) {

    const options = selectOptions(getKey("cart") ?? {})

    const [selectedOption, setSelectedOption] = useState(null)

    return (
        <div onClick={() => props.closeModal()} style={{height:'100%', overflow:'hidden', ...(props.containerStyle ? props.containerStyle : {})}} className="cactus-gender-model_top_view">
            <div onClick={ev => ev.stopPropagation()} style={{ minHeight:'70%', minWidth: '50rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {options.map((option, n) => <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
                            <div style={{ display: 'flex', width: '20rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2>{option?.question}</h2>
                                <Select disabled className='option-disabled' style={{ width: "15rem" }} value={option.answer}>
                                    {/* {console.log("CNAME", category?.name, -mins[category?.name])} */}
                                    <Option value={option.answer}>{option.answer}</Option>
                                </Select>
                            </div>
                        </div>)}
                        {/* <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', opacity: selectedOption === null ? "0.5" : undefined, pointer: selectedOption === null ? "default" : "cursor", alignSelf: 'center' }} onClick={() => {
                            props.onClick(selectedOption == 1, props.additionalData)
                        }}>
                            <h3>Choisir</h3>
                        </button> */}
                    </div>
                </div>
               
            </div>
        </div>
    )
}

