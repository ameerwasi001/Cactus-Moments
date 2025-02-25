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
import { getKey, replaceS3, req } from '../../requests'
import { setParam } from '../../urlParams'
import "./dashboard.css";
import { ClipLoader } from "react-spinners";
import EventEmitter from 'events'
import { getDistribution, getInitialCategoryCharacters } from "../templeteDetail/TempleteDetail";

const getS3Url = id => `https://cactus-s3.s3.us-east-2.amazonaws.com/${id}.json?${1000+Math.random()*1000}`
const fetchObejct = id => fetch(getS3Url(id)).then(res => res.text()).then(
    x => {
        console.log("fetching", x, x.split('drivebuddyz').join('cactus-s3'))
        return JSON.parse(
            decodeURIComponent(x.split('drivebuddyz').join('cactus-s3'))
        )
    }
)

const emitter = new EventEmitter()
const preloadImage = img => new Image().src = img

const useProduct = (searchString='') => {
    const { search, state } = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [searchData, setSearchData] = useState(searchString)
    const [templeteArray, setTemplateArray] = useState([]);
    const [loadedProducts, setLoadedProducts] = useState({})
    const [productLoading, setProductLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("poster")
    const [min, setMin] = useState(null)
    const [max, setMax] = useState(null)

    const produCategoryData = templeteArray.map(x => x.productCategories).filter(x => !!x).flat(1).map(X => X.toLowerCase())
    const categories = useMemo(
        () => [...(new Set(produCategoryData))],
        [templeteArray]
    )
    console.log("CATEOID", templeteArray.map(x => x.productCategories), produCategoryData, categories)

    const [selectedCategories, setSelectedCategories] = useState(new Set())
    const filteredProducts_ = templeteArray
        .filter(p => {
            return p?.productCategry?.toLowerCase() == selectedCategory.toLowerCase()
        })
        .filter(p => {
            if(selectedCategories.size == 0) return true
            if(!p?.productCategories) return false
            return p?.productCategories?.map(x => x.toLowerCase())?.map(cat => selectedCategories.has(cat))?.reduce((a, b) => a || b, false)
        })
        .filter(p => min === null || isNaN(parseInt(min)) ? true : parseInt(min) <= parseInt(p.maxPresentationalCharacters))
        .filter(p => 
            !max ? 
                true : 
                p.maxPresentationalCharacters ? 
                    (max === null || isNaN(parseInt(max)) ? true : parseInt(max) <= parseInt(p.maxPresentationalCharacters)) :
                    false
        )
        .filter(p => {
            return p?.keywords?.map(x => x.toLowerCase())?.find(x => x?.toLowerCase()?.includes(searchData?.toLowerCase())) || 
                p.mainDesc?.toLowerCase()?.includes(searchData?.toLowerCase())
        })
        // .filter(p => p.maxPresentationalCharacters !== undefined)

        console.log("prio", filteredProducts_.filter(x => x?.productPriority))
    const filteredProducts = [
        ...filteredProducts_.filter(x => x?.productPriority).sort(p => parseInt(p?.productPriority) > parseInt(p?.productPriority) ? 1 : -1),
        ...filteredProducts_.filter(x => !x?.productPriority),
    ]
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
        req('GET', `/user/product?select=${encodeURIComponent("_id productPriority name maxPresentationalCharacters keywords max category productCategories productCategry hidden mainDesc defaultIllustration price")}`)
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

        categories,
        selectedCategories,
        setSelectedCategories,
        // setCategory,

        min,
        setMin,
        max,
        setMax,

        searchData,
        setSearchData,
    }
}

export default useProduct