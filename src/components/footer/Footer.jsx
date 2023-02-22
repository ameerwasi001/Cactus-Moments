import React from 'react'
import { useNavigate } from 'react-router-dom'
import { footerSend, facebook, instagram, linkedIn, } from '../../assets'
import './footer.css'

export default function Footer() {
    const navigate = useNavigate()
    return (
        <div className='cactus-footerTopView'>
            <div className='cactus-footerContainer' >
                <div className='cactus-footerItemTopView'>
                    <h1>About us</h1>
                    <h4>Logo</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio fusce ut dictumst sollicitudin lorem ac nisi. At feugiat erat massa vitae. Elit donec ut elit quis in nunc mauris. Facilisis leo aenean magna nisl sed elementum. Odio fusce ut dictumst sollicitudin lorem ac nisi.</p>
                    <div className='cactus-footerSocialView'>
                        <img src={facebook} alt='' />
                        <img src={linkedIn} alt='' />
                        <img src={instagram} alt='' />
                    </div>
                </div>
                <div className='cactus-footerItemTopView margin100'>
                    <h1>Website</h1>
                    <h2 onClick={() => navigate('/')}>Home</h2>
                    <h2 onClick={() => navigate('/aboutus')}>About us</h2>
                    <h2 onClick={() => navigate('/poster')}>Templates</h2>
                    <h2 onClick={() => navigate('/privacypolicy')}>Privacy Policy</h2>
                    <h2 onClick={() => navigate('/terms')}>Terms and Conditions</h2>
                </div>
                <div className='cactus-footerItemTopView'>
                    <h1 style={{ marginBottom: 5 }}>Support</h1>
                    <h2 onClick={() => navigate('/contactus')}>Contact us</h2>
                    <div className='cactus-footer-input_text_view'>
                        <input placeholder='Email address' />
                        <img src={footerSend} alt={''} />
                    </div>
                </div>
            </div>
            <h3>Copyrights © Cactus Moments 2023 | Powered by TX Dynamics</h3>
        </div>
    )
}
