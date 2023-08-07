import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'

const { Option } = Select

const getCategoryMaxes = (max, categories) => {
    const maxDict = Object.fromEntries(categories.map(cat => [cat.name, 0]))
    let runningMax = 0
    for(const cat of categories) {
        if(maxDict[cat.name] + 1 >= parseInt(cat.max)) continue
        if(runningMax >= max) break
        maxDict[cat.name] += 1
        runningMax += 1
    }
    console.log(maxDict)
    const newCategories = categories.map(cat => ({ ...cat, max: maxDict[cat.name] }))
    return newCategories
}

const getMax = categories => categories.map(cat => cat.max).map(x => parseInt(x)).reduce((a, b) => a+b, 0)

export default function DefaultModel(props) {
    const product = props.product
    const ogProduct = props.ogProduct
    ogProduct.max = parseInt(ogProduct.max)
    const [categories, setCategories] = useState(props.autoSelect ? getCategoryMaxes(ogProduct.max, props.product.categories) : props.product.categories)
    const [overSelected, setOverselected] = useState(false)

    useEffect(() => console.log("MODAL PRODUCT", product), [product])
    useEffect(() => {
        console.log("MODAL CATEGORIES", props.autoSelect, categories)
        if(getMax(categories) > ogProduct.max) setOverselected(true)
        else setOverselected(false)
    }, [categories])

    return (
        <div style={{height:'100%', overflow:'hidden'}} className="cactus-gender-model_top_view">
            <div style={{ minHeight:'70%', minWidth: '30rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {ogProduct.categories.map((category, n) => <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
                            <div style={{ display: 'flex', width: '10rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2>{category?.name}</h2>
                                <Select value={categories.find(c => c.name === category?.name)?.max} onChange={val => {
                                    const newCategories = JSON.parse(JSON.stringify(categories))
                                    newCategories[n].max = val
                                    setCategories(newCategories)
                                }}>
                                    <Option value={0}>0</Option>
                                    {new Array(parseInt(category?.max ?? 0)).fill(0).map((_, i) => i+1).map(i => <Option value={i}>{i}</Option>)}
                                </Select>
                            </div>
                        </div>)}
                        <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', opacity: getMax(categories) > ogProduct.max ? "0.5" : undefined, pointer: getMax(categories) > ogProduct.max ? "default" : "cursor", alignSelf: 'center' }} onClick={() => {
                            if(getMax(categories) > ogProduct.max) return
                            const newProduct = {...product}
                            newProduct.categories = categories
                            props.onClick(newProduct)
                        }}>
                            <h3>Select</h3>
                        </button>
                        {getMax(categories) > ogProduct.max && <div style={{ color: "red", maxWidth: "20rem", marginTop: "2rem" }}>Only {ogProduct.max} characters are allowed, you have selected {getMax(categories)} characters</div>}
                    </div>
                </div>
               
            </div>
        </div >
    )
}

