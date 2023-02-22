import React, { useState } from 'react'
import './navbar.css'
import close from '../../assets/close.png'
import menu from '../../assets/menu.png'
import { logo, search } from '../../assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
    const [toggleMenu, setToggleMenu] = useState(false)
    const Menu = () => (
        <>
            <div className='cactus__navbar-links_text_view'>
                <h1 onClick={() => navigate('/')} style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/' ? 'solid' : 'none' }} >Home</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 onClick={() => navigate('/poster')} style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/poster' ? 'solid' : 'none' }}>Poster</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/mug' ? 'solid' : 'none' }}>Mug</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/giftidea' ? 'solid' : 'none' }}>Gift Idea</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 onClick={() => navigate('/aboutus')} style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/aboutus' ? 'solid' : 'none' }}>About us</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 onClick={() => navigate('/contactus')} style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/contactus' ? 'solid' : 'none' }}>Contact Us</h1>
            </div>
            <div onClick={() => navigate('/searchpage')} className='cactus__navbar-links_input_view'>
                <input disabled placeholder='Search' />
                <img alt='' src={search} />
            </div>
        </>
    )

    return (
        <div className='cactus__navbar'>
            <div className='cactus__navbar-links_logo'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='cactus__navbar-links'>
                <div className='cactus_navbar-links_container'>
                    <Menu />
                </div>
            </div>
            <div className='cactus__navbar-menu'>
                {toggleMenu ?
                    <img alt='Close' onClick={() => setToggleMenu(!toggleMenu)} src={close} className='cactus__navbar_closeIcon' />
                    :
                    <img alt='Menu' onClick={() => setToggleMenu(!toggleMenu)} src={menu} className='cactus__navbar_menuIcon' />
                }
                {toggleMenu &&
                    <div className='cactus__navbar-menu_container scale-up-center'>
                        <div className='cactus__navbar-menu_container_links'>
                            <Menu />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar
