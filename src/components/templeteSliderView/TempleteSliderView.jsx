import React from 'react'
import { dummyRoundOne, dummyRoundTwo, dummyRoundThree, arrowBack, arrowNext } from '../../assets'
import './templeteSliderView.css'

export default function TempleteSliderView(props) {
    const templateArray = [
        {
            id: 1,
            title: 'Poster',
            image: dummyRoundOne
        },
        {
            id: 2,
            title: 'Mug Personalize',
            image: dummyRoundTwo
        },
        {
            id: 3,
            title: 'Gift Ideas',
            image: dummyRoundThree
        }
    ]
    return (
        <div className="cactus-dashboard-slider_top_view">
            <div className="cactus-dashboard-slider_title_view" style={props.style}>
                <h1>{props.title}</h1>
                {props.viewAll &&
                    <h2>View all</h2>
                }
            </div>
            <div className="cactus-dashboard-slider_view">
                <div className="cactus-dashboard-slider_arrow_image">
                    <img src={arrowBack} alt='' />
                </div>
                <div className="cactus-dashboard-slider_templete_top_view">
                    {templateArray.map((item) => {
                        return (
                            <div key={item.id} className="cactus-dashboard-slider_templete_view">
                                <img src={item.image} alt="" />
                                <h2>{item.title}</h2>
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
