import React, { useEffect, useState } from 'react'
import { arrowBack, closeBox, female, male, maleDummy, radioFilled, radio } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'
import { getKey } from '../../requests'

const { Option } = Select

const findPrice = p => Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a+b, 0)

const selectOptions = opts => {
    const obj = {}
    const objp = {}
    const objimg = {}

    for(const order of opts) objp[order?.selections?.product?.mainDesc] = 0
    for(const order of opts) objimg[order?.selections?.product?.mainDesc] = []

    for(const order of opts) {
        if(order?.selections?.img) objimg[order?.selections?.product?.mainDesc].push(order?.selections?.img)
        obj[order?.selections?.product?.mainDesc] = (obj[order?.selections?.product?.mainDesc] ?? 0) + findPrice(order)
        objp[order?.selections?.product?.mainDesc] += 1
    }
    console.log("UPLOADED-IMG ", objimg)
    return Object.entries(obj).map(([k, v]) => ({ question: `${k} x ${objp[k]}`, images: objimg[k], answer: `${v}€` }))
}

export default function DefaultModel(props) {

    const options = selectOptions(getKey("cart") ?? {})

    const [selectedOption, setSelectedOption] = useState(null)
    const [scrollList, setScrollList] = useState({})

    return (
        <div onClick={() => props.closeModal()} style={{height:'100%', overflow:'hidden', ...(props.containerStyle ? props.containerStyle : {})}} className="cactus-gender-model_top_view">
            <div onClick={ev => ev.stopPropagation()} style={{ minHeight:'70%', minWidth: '50rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {options.map((option, n) => <div style={{display: 'flex', width: '100%', marginBottom: '10px'}}>
                            <div style={{ display: 'flex', width: '32rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src={arrowBack}
                                            className="cactus-templete_detail_side__view_arrow_up"
                                            style={{
                                                transform: 'rotate(0deg)', 
                                                cursor: (scrollList[`cactus-current-list-${n}`] ?? 1) == 1 ? 'default' : undefined, 
                                                opacity: (scrollList[`cactus-current-list-${n}`] ?? 1) == 1 ? '0.5': '1' 
                                            }}
                                            onClick={() => {
                                                setScrollList({ ...scrollList, [`cactus-current-list-${n}`]: Math.max((scrollList[`cactus-current-list-${n}`] ?? 1) - 1, 1) })
                                                document.getElementById(`cactus-current-list-${n}`).scrollLeft -= 150
                                            }}
                                        />
                                        <div id={`cactus-current-list-${n}`} style={{ display: 'flex', width: '150px', overflowX: 'hidden' }}>
                                            {option?.images && option?.images?.length && option.images.map(img => <img className="commander-modal-img" src={img}/>)}
                                        </div>
                                        <img
                                            src={arrowBack}
                                            className="cactus-templete_detail_side__view_arrow_up"
                                            style={{
                                                transform: 'rotate(180deg)', 
                                                cursor: (scrollList[`cactus-current-list-${n}`] ?? 1) == option?.images?.length ? 'default' : undefined, 
                                                opacity: (scrollList[`cactus-current-list-${n}`] ?? 1) == option?.images?.length ? '0.5' : '1' 
                                            }}
                                            onClick={() => {
                                                setScrollList({ ...scrollList, [`cactus-current-list-${n}`]: Math.min((scrollList[`cactus-current-list-${n}`] ?? 1) + 1, option?.images?.length) })
                                                document.getElementById(`cactus-current-list-${n}`).scrollLeft += 150
                                            }}
                                        />
                                    </div>
                                    {/* <p>{scrollList[`cactus-current-list-${n}`] ?? 1}/{option?.images?.length}</p> */}
                                </div>
                                <h2 style={{ marginLeft: "30px", marginRight: "30px" }}>{option?.question}</h2>
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

