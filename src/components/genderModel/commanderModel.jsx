import React, { useEffect, useState } from 'react'
import { arrowBack, closeBox, female, male, maleDummy, radioFilled, radio, emptyCart, close, closeBlack } from '../../assets'
import { Select } from 'antd'
import './genderModel.css'
import { getKey, req, setKey } from '../../requests'
import { useNavigate, useNavigation } from 'react-router-dom'
import { setParam } from '../../urlParams'
import { ScaleLoader } from 'react-spinners'

const { Option } = Select


const getSelectionPricing = p => Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a+b, 0)
const getPrice = () => (getKey("cart") ?? []).map(getSelectionPricing).reduce((a, b) => a+b, 0)
const findPrice = p => Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a+b, 0)

const groupPrcing = pricings => {
    const grouped = {}
    for(const pricing of pricings) grouped[pricing.section] = []
    for(const pricing of pricings) grouped[pricing.section].push(pricing)
    return grouped
}

const getOrderPricingOptions = order => {
    const pricingGrouped = groupPrcing(order?.selections?.product?.pricing)
    return Object.entries(order?.selections ?? {})
        .filter(([k]) => k.startsWith("pricing-"))
        .map(([k, answer]) => ({
            question: k.replace("pricing-", ""), 
            answer,
            answers: pricingGrouped[k.replace("pricing-", "")],
        }))
}

const selectOptions = opts => {
    const obj = {}
    const objp = {}
    const objimg = {}
    const objorders = {}

    for(const order of opts) objp[order?.selections?.product?.mainDesc] = 0
    for(const order of opts) objimg[order?.selections?.product?.mainDesc] = []
    for(const order of opts) objorders[order?.selections?.product?.mainDesc] = []


    for(const order of opts) {
        if(order?.selections?.img) objimg[order?.selections?.product?.mainDesc].push(order?.selections?.img)
        if(order?.selections?.img) {
            objorders[order?.selections?.img] = order
        }
        obj[order?.selections?.product?.mainDesc] = (obj[order?.selections?.product?.mainDesc] ?? 0) + findPrice(order)
        objp[order?.selections?.product?.mainDesc] += 1
    }
    console.log("UPLOADED-IMG ", objimg)
    return Object.entries(obj).map(([k, v]) => ({
        name: k,
        question: `${k} x ${objp[k]}`,
        answer: `${v}€`,
        images: objimg[k].map(img => ({
            img,
            order: objorders[img],
            pricingOptions: getOrderPricingOptions(objorders[img])
        })) 
    }))
}

export default function DefaultModel(props) {

    const [ogOrders, setOgOrders] = useState(getKey("cart") ?? {})
    const [options, setOptions] = useState(selectOptions(getKey("cart") ?? []))
    const navigate = useNavigate()

    const [selectedOption, setSelectedOption] = useState(null)
    const [scrollList, setScrollList] = useState({})
    const [loading, setLoading] = useState(false)

    const [hoverCross, setHoverCross] = useState(null)

    console.log(options)
    return (
        <div onClick={() => props.closeModal()} style={{height:'100%', overflow:'hidden', ...(props.containerStyle ? props.containerStyle : {})}} className="cactus-gender-model_top_view">
            <div onClick={ev => ev.stopPropagation()} style={{ minHeight:'70%', alignItems: options.length == 0 ? "center" : null, minWidth: '50rem', width: 'unset', justifyContent: 'center', flexDirection: 'column' }} className='cactus-gender_model_view'>
                {options.length == 0 ? <>
                    <img src={emptyCart} style={{ height: 300 }}/>
                    <h2>Your cart is empty</h2>
                </> : <>
                    <div className='cactus-gender_model_side_top_view' style={{ width: '100%' }}>
                        <div style={{ display: 'flex', marginBottom: '3rem', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: loading ? 'center' : undefined }}>
                            {loading ? <ScaleLoader color='#000' /> : options.map((option, n) => <div style={{ display: 'flex', width: '100%', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', width: '32rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={arrowBack}
                                                className="cactus-templete_detail_side__view_arrow_up"
                                                style={{
                                                    transform: 'rotate(0deg)',
                                                    cursor: (scrollList[`cactus-current-list-${n}`] ?? 1) == 1 ? 'default' : undefined,
                                                    opacity: (scrollList[`cactus-current-list-${n}`] ?? 1) == 1 ? '0.5' : '1'
                                                }}
                                                onClick={() => {
                                                    setScrollList({ ...scrollList, [`cactus-current-list-${n}`]: Math.max((scrollList[`cactus-current-list-${n}`] ?? 1) - 1, 1) })
                                                    document.getElementById(`cactus-current-list-${n}`).scrollLeft -= 150
                                                }}
                                            />
                                            <div id={`cactus-current-list-${n}`} style={{ display: 'flex', width: '150px', background: "red", overflowX: 'hidden' }}>
                                                {option?.images && option?.images?.length && option.images.map(({ img, order }) => <div style={{ width: "150px" }}>
                                                    <img className="commander-modal-img" onClick={async () => {
                                                        const productId = order?.selections?.product?._id
                                                        console.log("orderx1", order)

                                                        const redirectData = {
                                                            product: JSON.stringify(order?.selections?.product),
                                                            props: encodeURIComponent(JSON.stringify({
                                                                ...order?.selections
                                                            })),
                                                            order: order.id,
                                                        }

                                                        if (window.location.href.includes(`templetedetail?title=${order?.selections?.mainDesc?.split(" ")?.join("-")}`)) return navigate('/', { state: { redirect: redirectData } })

                                                        setLoading(true)
                                                        const { product } = await req("GET", `/user/product/${productId}`)
                                                        setLoading(false)

                                                        const params = {
                                                            editData: encodeURIComponent(JSON.stringify({ ...redirectData })),
                                                            product: JSON.stringify(product),
                                                        }

                                                        const url = `/templetedetail?title=${product?.mainDesc?.split(" ")?.join("-")}`
                                                        navigate(url, { state: params })
                                                    }} src={img} />
                                                    <div
                                                        style={{ display: "flex", height: 80, width: 25, marginLeft: -25, marginTop: 10  }}
                                                    >
                                                        <div
                                                            style={{ height: 15, width: 15, cursor: "pointer" }}
                                                            onMouseEnter={() => setHoverCross({ index: scrollList[`cactus-current-list-${n}`] ?? 1, option })}
                                                            onMouseLeave={() => setHoverCross(null)}
                                                            onClick={() => {
                                                                const cart = getKey("cart") ?? []
                                                                const newCart = cart.filter(
                                                                    corder => corder?.selections?.uuid != order?.selections?.uuid
                                                                )
                                                                setKey("cart", [...newCart])
                                                                setOptions(selectOptions(getKey("cart")))
                                                            }}
                                                        >
                                                            <img
                                                                src={closeBlack}
                                                                style={{
                                                                    width: 10,
                                                                    height: 10,
                                                                    ...(
                                                                        (hoverCross?.index == (scrollList[`cactus-current-list-${n}`] ?? 1)) && (hoverCross?.option?.question == option?.question) ? {
                                                                            filter: "invert(17%) sepia(87%) saturate(5995%) hue-rotate(359deg) brightness(106%) contrast(124%)",
                                                                            scale: "1.2"
                                                                        } : {}
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>)}
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
                                        <p style={{ fontSize: "12px" }}>€{getSelectionPricing(option?.images?.[Math.max((scrollList[`cactus-current-list-${n}`] ?? 0) - 1, 0)]?.order)}</p>
                                    </div>
                                    <h2 style={{ marginLeft: "30px", marginRight: "30px" }}>{option?.question}</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {option?.images?.[Math.max((scrollList[`cactus-current-list-${n}`] ?? 0) - 1, 0)]?.pricingOptions?.map((poption, k) => <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', width: '20rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h2>{poption?.question}</h2>
                                            <Select style={{ width: "15rem" }} value={poption.answer} onChange={text => {
                                                const optArr = options.map((optx, nx) => n == nx ? { ...optx, images: optx.images.map(img => ({ ...img, pricingOptions: img?.pricingOptions?.map((popt, kx) => kx == k ? { ...popt, answer: text } : popt) })) } : optx)
                                                setOptions(optArr)

                                                const cart = getKey("cart") ?? []

                                                const obj = option?.images?.[Math.max((scrollList[`cactus-current-list-${n}`] ?? 0) - 1, 0)]
                                                const order = obj?.order
                                                const currProduct = cart.find(c => c.selections.uuid == order.selections.uuid)
                                                console.log(currProduct)
                                                // console.log(cart, currProduct, opt.question)
                                                currProduct.selections[poption.question] = text
                                                currProduct.selections[`pricing-${poption.question}`] = text
                                                const price = Object.entries(currProduct?.selections)
                                                    .filter(([k]) => k.startsWith("pricing-"))
                                                    .map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0))
                                                    .reduce((a, b) => a + b, 0)
                                                currProduct.selections.product.price = price

                                                // console.log(">>", cart)
                                                setKey("cart", [...cart])
                                            }}>
                                                <Option value={poption.answer}>{poption.answer}</Option>
                                                {
                                                    poption
                                                        .answers
                                                        .filter(opt => opt.name != poption.answer)
                                                        .map(option => <Option value={option.name}>{option.name}</Option>)
                                                }
                                            </Select>
                                        </div>
                                    </div>)}
                                </div>
                            </div>)}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            className="cactus-templete_detail-order_button"
                            style={{ color: "white", width: "100px", height: "40px", fontSize: "15px", marginBottom: "1rem" }}
                            onClick={() => props.payClciked()}
                        >
                            Pay €{getPrice()}
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
}

