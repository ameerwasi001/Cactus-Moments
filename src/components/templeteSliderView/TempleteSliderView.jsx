import React, { useState, useEffect } from 'react'
import { dummyRoundOne, dummyRoundTwo, dummyRoundThree, arrowBack, arrowNext } from '../../assets'
import './templeteSliderView.css'
import { req } from '../../requests'

export default function TempleteSliderView(props) {
    const [templateArray, setTemplateArray] = useState([])
    console.log(props)

    useEffect(() => {
        req('GET', '/user/productType').then(({productTypes}) => setTemplateArray([{
            id: 1,
            name: 'Poster',
            image: dummyRoundOne,
            priority: 1,
        }, ...productTypes.filter(x => !!x.name).map((x, i) => ({ ...x, id: i+2 }))]))
    }, [])

    return (
        <div id="main-templates" className="cactus-dashboard-slider_top_view">
            <div className="cactus-dashboard-slider_title_view" style={props.style}>
                <h1>{props.title}</h1>
                {props.viewAll &&
                    <h2>Voir tout</h2>
                }
            </div>
            <div className="cactus-dashboard-slider_view">
                <div className="cactus-dashboard-slider_arrow_image">
                    <img src={arrowBack} alt='' />
                </div>
                <div className="cactus-dashboard-slider_templete_top_view">
                    {templateArray.sort((a, b) => a.priority > b.priority ? 1 :- 1).map((item) => {
                        return (
                            <div key={item.id} className="cactus-dashboard-slider_templete_view">
                                <img src={item.image} alt="" onClick={() => props.setSelectedCategory(item.name.toLowerCase())}/>
                                <h2>{item.name}s</h2>
                            </div>
                        )
                    })}
                </div>
                <div className="cactus-dashboard-slider_arrow_image">
                    <img src={arrowNext} alt='' />
                </div>
            </div>
        </div>
    )
}
