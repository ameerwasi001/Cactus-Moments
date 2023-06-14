import React, { useEffect, useState } from 'react'
import { closeBox, female, male, maleDummy } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'

const { Option } = Select

export default function DefaultModel(props) {
    const product = props.product
    const [categories, setCategories] = useState(props.product.categories)

    useEffect(() => console.log("MODAL PRODUCT", product), [product])
    useEffect(() => console.log("MODAL CATEGORIES", categories), [categories])

    return (
        <div style={{height:'100%', overflow:'hidden'}} className="cactus-gender-model_top_view">
            <div style={{ minHeight:'70%', minWidth: '30rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                    <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                        {product.categories.map((category, n) => <div style={{display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px'}}>
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
                        <button className='cactus-default-select-btn' style={{ color: 'whitesmoke', alignSelf: 'center' }} onClick={() => {
                            const newProduct = {...product}
                            newProduct.categories = categories
                            props.onClick(newProduct)
                        }}>
                            <h3>Select</h3>
                        </button>
                    </div>
                </div>
               
            </div>
        </div >
    )
}

