import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy, radioFilled, radio } from '../../assets'
import { Select } from 'antd'
import { getAllParams, setParam } from "../../urlParams";
import './genderModel.css'
import { getKey, setKey, req } from '../../requests'
import { useNavigate } from 'react-router-dom'
import { ScaleLoader } from "react-spinners";

const { Option } = Select

const findIndex = (f, arr) => {
    for(let i = 0; i < arr.length; i++)
      if(f(arr[i])) return i
    return -1
}

const productPositions = product => {
    const productNMax = product.categories?.map(x => parseInt(x.max ?? 0) ?? 0)?.reduce((a, b) => a+b, 0)
    const arr = product.categories
        .map(cat => new Array(parseInt(cat.max ?? 0) ?? 0).fill(cat))
        .map(arr => arr.map((cat, i) => cat?.subcategories?.[0]?.characters?.[0]))
        .reduce((a, b) => [...a, ...b], [])
        .slice(0, productNMax)
    const nameArr = product.categories
        .map(cat => new Array(parseInt(cat.max ?? 0) ?? 0).fill(cat))
        .map(arr => arr.map((cat, i) => [cat?.name, i+1]))
        .reduce((a, b) => [...a, ...b], [])
        .slice(0, productNMax)
    const poses = product.backgrounds[0]?.positions?.slice(0, productNMax)?.map((pos, i) => {
        const ret = {x: pos[0], y: pos[1], scale: pos[3], name: nameArr[i], isStatic: pos[5] != undefined && pos[5] != 0, staticAssociation: pos[5] != undefined && pos[5] != 0 ? nameArr[i] : null}
        console.log("POSIT", pos[5], ret)
        return ret
    }) ?? []
    return poses
}

const minCategoryGivenStatics = product => {
    const positions = productPositions(product)
    const dict = {}
    for(const p of product.categories) dict[p.name] = 0
    for(const p of positions){
        if(p.isStatic) {
            console.log("P", p.staticAssociation)
            dict[p.staticAssociation[0]] += 1
        }}
    return dict
}

const getCategoryMaxes = (max, categories, ogProduct) => {
    const staicsDict = minCategoryGivenStatics(ogProduct)
    categories?.forEach(cat => cat.min = staicsDict[cat.name])
    console.log(staicsDict, categories)
    const maxDict = Object.fromEntries(categories.map(cat => [cat.name, cat.min]))
    let runningMax = 0
    for(const cat of categories) {
        console.log(cat.max, maxDict[cat.name]+1)
        if(maxDict[cat.name] + 1 > parseInt(cat.max)) continue
        if(runningMax >= max) break
        maxDict[cat.name] += 1
        runningMax += 1
    }
    // console.log(maxDict, runningMax, max)
    const newCategories = categories.map(cat => ({ ...cat, max: maxDict[cat.name] }))
    return newCategories
}

const getMax = categories => categories.map(cat => cat.max).map(x => parseInt(x)).reduce((a, b) => a+b, 0)
const groupPrcing = pricings => {
    const grouped = {}
    for(const pricing of pricings) grouped[pricing.section] = []
    for(const pricing of pricings) grouped[pricing.section].push(pricing)
    return grouped
}


export default function DefaultModel(props) {

    console.log("abcd", props.additionalData)
    const pricingGrouped = groupPrcing(props?.additionalData?.selections?.product?.pricing)

    const [price, setPrice] = useState(props?.additionalData?.selections?.product?.price)
    const navigate = useNavigate()
    const img = props?.additionalData?.selections?.img
    const [options, setOptions] = useState(
        Object.entries(props?.additionalData?.selections ?? {})
            .filter(([k]) => k.startsWith("pricing-"))
            .map(([k, answer]) => ({
            question: k.replace("pricing-", ""), 
            answer,
            answers: pricingGrouped[k.replace("pricing-", "")],
        }))
    )

    const [selectedOption, setSelectedOption] = useState(null)

    const [loading, setLoading] = useState(false)

    return (
        <div onClick={() => props.closeModal()} style={{height:'100%', overflow:'hidden', ...(props.containerStyle ? props.containerStyle : {})}} className="cactus-gender-model_top_view">
            <div onClick={ev => ev.stopPropagation()} style={{ minHeight:'70%', minWidth: '50rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%', alignItems: 'center' }}>
                    {img && !loading && <img onClick={async () => {
                        const productId = props?.additionalData?.selections?.product?._id

                        const redirectData = {
                            product: JSON.stringify(props?.additionalData?.selections?.product),
                            props: encodeURIComponent(JSON.stringify({
                                ...props?.additionalData?.selections
                            })),
                            order: props.additionalData.id,
                        }

                        if(window.location.href.includes("templetedetail")) return navigate('/', { state: { redirect: redirectData } })

                        setLoading(true)
                        const { product } = await req("GET", `/user/product/${productId}`)
                        setLoading(false)

                        const params = {
                            editData: encodeURIComponent(JSON.stringify({ ...redirectData })),
                            product: JSON.stringify(product),
                        }
                        const url = `/templetedetail?${setParam(params)}`
                        if(window.location.href.includes("templetedetail")) navigate('/', { state: { redirect: redirectData } })
                        else navigate(url)
                    }} src={img} style={{ width: "200px" }}/>}
                    {img && loading && <div className='click-loader-container'>
                        <ScaleLoader color='#000'/>
                    </div>}
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {options.map((option, n) => <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
                            <div style={{ display: 'flex', width: '20rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2>{option?.question}</h2>
                                <Select style={{ width: "15rem" }} value={option.answer} onChange={text => {
                                    const newOptions = [ ...options ]
                                    console.log("abcd", newOptions[n].answer, text)
                                    newOptions[n].answer = text
                                    setOptions(newOptions)
                                }}>
                                    {/* {console.log("CNAME", category?.name, -mins[category?.name])} */}
                                    <Option value={option.answer}>{option.answer}</Option>
                                    {
                                        option
                                            .answers
                                            .filter(opt => opt.name != option.answer)
                                            .map(option => <Option value={option.name}>{option.name}</Option>)
                                    }
                                </Select>
                            </div>
                        </div>)}
                        {/* <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', opacity: selectedOption === null ? "0.5" : undefined, pointer: selectedOption === null ? "default" : "cursor", alignSelf: 'center' }} onClick={() => {
                            props.onClick(selectedOption == 1, props.additionalData)
                        }}>
                            <h3>Choisir</h3>
                        </button> */}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            className="cactus-templete_detail-order_button"
                            style={{ color: "white", width: "100px", height: "40px", fontSize: "15px" }}
                            onClick={() => {
                                console.log("abcdef", props)
                                const cart = getKey("cart") ?? []
                                const currProduct = cart[props?.additionalData?._id]
                                for(const opt of options) {
                                    currProduct.selections[opt.question] = opt.answer
                                    currProduct.selections[`pricing-${opt.question}`] = opt.answer
                                }
                                const price = Object.entries(currProduct?.selections)
                                    .filter(([k]) => k.startsWith("pricing-"))
                                    .map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0))
                                    .reduce((a, b) => a+b, 0)
                                currProduct.selections.product.price = price
                                console.log("abcdefgh", price)
                                setKey("cart", cart)
                                props.closeModal()
                            }}
                        >
                            Save
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    )
}

