import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy, radioFilled, radio } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'
import { OFFLINE } from '../../constants'
import { getKey } from '../../requests'

const { Option } = Select


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

export default function DefaultModel(props) {
    const options = [
        {
            id: 1,
            text: "Paiement par carte bancaire avec livraison à domicile. Frais d’envoi : France 6€, autre pays européen : 10€. Livraison gratuite à partir de 50€."
        },
        // {
        //     id: 2,
        //     text: "Paiement par carte et récupération de l'achat au marché de Noël d'Arras 2023 (sans frais de livraison)"
        // },
        {
            id: 3,
            text: "Commande sur place"
        },
    ].filter(opt => {
        if(!(JSON.parse(getKey('vendor') ?? null))) return true
        return JSON.parse(getKey('vendor') ?? null) && opt.id == 3

    })
    const [selectedOption, setSelectedOption] = useState(null)

    return (
        <div onClick={() => props.closeModal()} style={{height:'100%', overflow:'hidden', ...(props.containerStyle ? props.containerStyle : {})}} className="cactus-gender-model_top_view">
            <div onClick={ev => ev.stopPropagation()} style={{ minHeight:'70%', minWidth: '50rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {options.map(opt => <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
                            <div style={{ display: 'flex', width: '30rem', alignItems: 'center', fontFamily: "K2D" }}>
                                <img className='choice-fill' src={opt.id == selectedOption ? radioFilled : radio} style={{ marginRight: "1rem", cursor: "pointer" }} onClick={() => setSelectedOption(selectedOption == opt.id ? null : opt.id)} />
                                <h2>{opt?.text}</h2>
                            </div>
                        </div>)}
                        <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', opacity: selectedOption === null ? "0.5" : undefined, pointer: selectedOption === null ? "default" : "cursor", alignSelf: 'center' }} onClick={() => {
                            props.onClick(selectedOption, props.additionalData)
                        }}>
                            <h3>Choisir</h3>
                        </button>
                    </div>
                </div>
               
            </div>
        </div >
    )
}

