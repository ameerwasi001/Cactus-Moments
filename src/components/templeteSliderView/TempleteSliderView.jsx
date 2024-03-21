import React, { useState, useEffect } from 'react'
import { dummyRoundOne, search, dummyRoundThree, arrowBack, arrowNext, rightArrowSign, leftArrowSign, filtersIcon } from '../../assets'
import './templeteSliderView.css'
import { req } from '../../requests'

export default function TempleteSliderView(props) {
    const [templateArray, setTemplateArray] = useState([])
    console.log(props)

    useEffect(() => {
        req('GET', '/user/productType').then(({productTypes}) => {
            const arr = [{
                id: 1,
                name: 'Poster',
                image: dummyRoundOne,
                priority: 1,
            }, ...productTypes.filter(x => !!x.name).map((x, i) => ({ ...x, id: i+2 }))]
                .sort((a, b) => a.priority > b.priority ? 1 :- 1)
            props.setSelectedCategory(arr[0]?.name, { navigate: false })
            setTemplateArray(arr)
        })
    }, [])

    return (
        <div id="main-templates" className="cactus-dashboard-slider_top_view">
            {props?.title && <div className="cactus-dashboard-slider_title_view" style={props.style}>
                <h1>{props.title}</h1>
                {props.viewAll &&
                    <h2>Voir tout</h2>
                }
            </div>}
            <div className="cactus-dashboard-slider_view">
                <div className="cactus-dashboard-slider_arrow_image" onClick={() => document.getElementById("category-slider").scrollLeft -= props.isPhone ? 200 : 100}>
                    <img style={{ transform: 'rotate(180deg)' }} src={leftArrowSign} alt=''/>
                </div>
                <div id="category-slider" className="cactus-dashboard-slider_templete_top_view">
                    {templateArray.sort((a, b) => a.priority > b.priority ? 1 :- 1).map((item) => {
                        return (
                            <div onClick={() => props.setSelectedCategory(item.name.toLowerCase(), { navigate: true })} key={item.id} className="cactus-dashboard-slider_templete_view">
                                <img src={item.image} alt="" onClick={() => props.setSelectedCategory(item.name.toLowerCase(), { navigate: true })}/>
                                <h2 onClick={() => props.setSelectedCategory(item.name.toLowerCase(), { navigate: true })}>{item.name}s</h2>
                            </div>
                        )
                    })}
                </div>
                <div className="cactus-dashboard-slider_arrow_image" onClick={() => document.getElementById("category-slider").scrollLeft += props.isPhone ? 200 : 100}>
                    <img src={rightArrowSign} alt=''/>
                </div>
            </div>
            {props.isPhone && <div style={{ display: 'flex', marginTop: '2rem', alignItems: 'center', flexDirection: props.isPhone ? 'column' : 'row' }}>
                {/* <h2 style={{ fontFamily: 'K2D', fontSize: '3rem', fontWeight: '600', marginLeft: props.isPhone ? undefined : '-20px', marginBottom: props.isPhone ? '20px' : undefined }}>Popular Templates</h2> */}
                <h2 style={{ fontFamily: 'K2D', fontSize: '3rem', fontWeight: '600', marginLeft: props.isPhone ? undefined : '-20px', marginBottom: props.isPhone ? '20px' : undefined }}></h2>
                <div className="cactus-search-search_view">
                    <img src={search} className="cactus-search-search_icon" />
                    <input onChange={ev => props.setSearchData(ev.target.value)} value={props.searchData} placeholder="Recherche" />
                    {props.isPhone && <div className='cactus-search-filters-icon' onClick={() => props.setFiltersOpen(!props.filtersOpen)}>
                        <img src={filtersIcon}/>
                    </div>}
                </div>
            </div>}
        </div>
    )
}
