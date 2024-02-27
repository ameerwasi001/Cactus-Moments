import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  aboutUsImage,
  banner,
  dummyOne,
  dummyThree,
  dummyTwo,
  homeImage2,
  homeImage2Responsive,
  shape,
} from "../../assets";
import {
  ContactUsView,
  Footer,
  NavBar,
  TempleteSliderView,
  TempleteView,
} from "../../components";
import { getKey, req } from '../../requests'
import { setParam } from '../../urlParams'
import "./dashboard.css";
import { ClipLoader } from "react-spinners";
import EventEmitter from 'events'
import { getDistribution, getInitialCategoryCharacters } from "../templeteDetail/TempleteDetail";

const getS3Url = id => `https://cactus-s3.s3.us-east-2.amazonaws.com/${id}.json?${1000+Math.random()*1000}`
const fetchObejct = id => fetch(getS3Url(id)).then(res => res.text()).then(x => JSON.parse(decodeURIComponent(x)))

const emitter = new EventEmitter()
const preloadImage = img => new Image().src = img

const useProduct = () => {
    const { search, state } = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [templeteArray, setTemplateArray] = useState([]);
    const [loadedProducts, setLoadedProducts] = useState({})
    const [productLoading, setProductLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("poster")
    const filteredProducts = useMemo(
        () => templeteArray.filter(p => p.productCategry.toLowerCase() == selectedCategory.toLowerCase()),
        [templeteArray, selectedCategory]
    )
    const redirect = state?.redirect


    useEffect(() => {
        const f = async () => {
            console.log("PRODID2", redirect)

            if (!redirect) {
                setProductLoading(false)
                return
            }

            setProductLoading(true)
            const el = document.getElementById("main-products")
            el?.scrollIntoView()
            const { product } = await req("GET", `/user/product/${JSON.parse(redirect.product)?._id}`)
            setProductLoading(false)
            navigate(`/templetedetail?title=${product?.mainDesc}&productCategry=${product?.productCategry}`, {
                state: {
                    editData: encodeURIComponent(JSON.stringify({ ...redirect })),
                    product: JSON.stringify(product),
                }
            })
        }
        f()
    }, [])

    useEffect(() => {
        const f = async () => {
            const productId = search?.split("productId=")?.[1]
            const categoryName = search?.split("category=")?.[1]
            if (redirect) {
            } else if (productId) {
                const el = document.getElementById("main-products")
                el?.scrollIntoView()
                setLoading(true)
                const { product } = await req("GET", `/user/product/${productId}`)
                setLoading(false)
                navigate(`/templetedetail?title=${product?.mainDesc}&productCategry=${product?.productCategry}`, { state: { product: JSON.stringify(product) } })
            } else if (categoryName) {
                setSelectedCategory(categoryName)
                document?.getElementById("main-templates")?.scrollIntoView()
            } else {
                window.scrollTo(0, 0)
            }
        }
        f()
    }, [search])

    useEffect(() => {
        req('GET', `/user/product?select=${encodeURIComponent("_id name productCategry hidden mainDesc defaultIllustration price")}`)
            .then(({ products }) => {
                console.log(products)
                console.log("setting")
                const currVendor = JSON.parse(getKey("vendor") ?? 'null')
                const myProductIds = currVendor?.products
                const mappedProducts = products?.filter(p => !p.hidden)?.filter(prod => {
                    if (!myProductIds) return true
                    return myProductIds?.includes(prod._id)
                })?.filter(prod => prod.name)?.map((p, id) => { return { ...p, id, hidden: p.hidden, image: { url: p.defaultIllustration } } })
                setTemplateArray(mappedProducts)
                console.log("done setting", mappedProducts)
                setLoading(false)
            })
            .catch(e => console.error(e))
    }, [])

    useEffect(() => {
        if (templeteArray?.length) setLoading(false)
    }, [templeteArray])

    useEffect(() => {
        if (!templeteArray?.length) return

        for (const item of templeteArray)
            if (item?.backgrounds?.[0]) setLoadedProducts(loadedProducts => ({ ...loadedProducts, [item._id]: item }))
            else fetchObejct(item._id)
                .then(product => {
                    setLoadedProducts(loadedProducts => ({ ...loadedProducts, [item._id]: product }))

                    const firstBgUrl = product?.backgrounds?.[0]?.url
                    preloadImage(firstBgUrl)

                    if (window.location.href == '/') {
                        const [initDist, _1] = getDistribution(product, product, product?.backgrounds?.[0], [])
                        const chars = getInitialCategoryCharacters(product, initDist)
                        const [distribution, _2] = getDistribution(product, product, product?.backgrounds?.[0], chars)
                        for (const ch of distribution) preloadImage(ch?.sprite)
                    }

                    emitter.emit(item._id, product)
                })

    }, [templeteArray])

    useEffect(() => {
        return () => emitter.removeAllListeners()
    }, [])

    useEffect(() => {
        const vendor = JSON.parse(getKey('vendor') ?? null)
        if (vendor?.name) navigate(`/${vendor?.name}`)
    }, [])

    return {
        search,
        templeteArray,
        loadedProducts,
        productLoading,
        emitter,
        state,
        redirect,
        loading,
        setLoading,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
    }
}

export default useProduct