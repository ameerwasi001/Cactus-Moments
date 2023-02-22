import React from 'react'
import { colorPicker } from '../../assets'
import './templeteView.css'

export default function TempleteView(props) {
    const { item } = props
    return (
        <div key={item?.id} className="cactus-dashboard-templete_view">
            <div className="cactus-dashboard-templete_image_view">
                <img alt='' src={item?.image} />
            </div>
            <div>
                <div className="cactus-dashboard-templete_title_view" >
                    <h2>Personalize me</h2>
                    <img alt='' src={colorPicker} />
                </div>
                <h3>Personalized Ski family</h3>
                <h4>{props?.price}</h4>
            </div>
        </div>
    )
}
