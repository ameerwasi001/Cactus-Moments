import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'

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
        }
    }
    return dict
}

const getCategoryMaxes = (max, categories, ogProduct) => {
    const staicsDict = minCategoryGivenStatics(ogProduct)
    categories?.forEach(cat => cat.min = staicsDict[cat.name])
    console.log("MAX-START", max, staicsDict, categories)
    const maxDict = Object.fromEntries(categories.map(cat => [cat.name, 0]))    
    let runningMax = 0
    for(const cat of categories) {
        console.log("MAX-I", categories.length, runningMax)
        const cmax = parseInt(cat.archiveMax ? cat.archiveMax : (cat.max ? cat.max : '0'))
        if(maxDict[cat.name] + 1 > cmax) continue
        if(runningMax >= max) break
        if(Object.values(maxDict).reduce((a, b) => a+b, 0) + 1 > max) break
        maxDict[cat.name] += 1
        runningMax += 1
    }
    console.log("MAX-S", maxDict, runningMax, max)
    const newCategories = categories.map(cat => ({ ...cat, max: maxDict[cat.name] }))
    return newCategories
}

const getMax = categories => categories.map(cat => cat.archiveMax ?? cat.max).map(x => parseInt(x)).reduce((a, b) => a+b, 0)
const processMaxes = categories => categories.map(cat => ({...cat, max: parseInt(cat.archiveMax ?? cat.max)}))

export default function DefaultModel(props) {
    const product = props.product
    const hasStaticPositions = props.hasStaticPositions
    const ogProduct = props.ogProduct
    ogProduct.max = parseInt(ogProduct.max)
    const mins = Object.fromEntries(Object.entries(minCategoryGivenStatics(ogProduct)).map(([k, _]) => [k, 0]))
    console.log("_PRODUCT111", product)
    const [categories, setCategories] = useState(props.autoSelect ? getCategoryMaxes(ogProduct.max, props.product.categories, ogProduct) : processMaxes(props.product.categories))
    // const [categories, setCategories] = useState(getCategoryMaxes(ogProduct.max, props.product.categories, ogProduct))
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
                                    console.log("NEW-CAT", newCategories)
                                    setCategories(newCategories)
                                }}>
                                    {console.log("CNAME", category?.name, -mins[category?.name])}
                                    {[0, ...(new Array(parseInt(category?.max ?? 0)).fill(0).map((_, i) => i+1))].slice(-mins[category?.name]).map(i => <Option value={i}>{i}</Option>)}
                                </Select>
                            </div>
                        </div>)}
                        <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', opacity: getMax(categories) > ogProduct.max ? "0.5" : undefined, pointer: getMax(categories) > ogProduct.max ? "default" : "cursor", alignSelf: 'center' }} onClick={() => {
                            if(getMax(categories) > ogProduct.max) return
                            const newProduct = JSON.parse(JSON.stringify(product))
                            if(hasStaticPositions) newProduct.categories = ogProduct.categories.map(cat => ({
                                ...cat, 
                                modifiedMax: categories.filter(x => x.max > 0).find(cat2 => cat2.name == cat.name)?.max,
                                archiveMax: categories.find(cat2 => cat2.name == cat.name)?.max,
                                hidden: !categories.filter(x => x.max > 0).find(cat2 => cat2.name == cat.name)
                            }))
                            else newProduct.categories = categories
                            console.log("_PRODUCT111_2", categories, newProduct)
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

