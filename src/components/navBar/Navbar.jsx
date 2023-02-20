import React, { useState } from 'react'
import './navbar.css'
import close from '../../assets/close.png'
import menu from '../../assets/menu.png'
import { useNavigate } from "react-router-dom";
import { logo, search } from '../../assets';

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false)
    const navigate = useNavigate()
    const Menu = () => (
        <>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/' ? 'solid' : 'none' }} >Home</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/poster' ? 'solid' : 'none' }}>Poster</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/mug' ? 'solid' : 'none' }}>Mug</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/giftIdea' ? 'solid' : 'none' }}>Gift Idea</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/aboutUs' ? 'solid' : 'none' }}>About us</h1>
            </div>
            <div className='cactus__navbar-links_text_view'>
                <h1 style={{ borderBottomStyle: window.location.href === 'http://localhost:3000/contactUs' ? 'solid' : 'none' }}>Contact Us</h1>
            </div>
            <div className='cactus__navbar-links_input_view'>
                <input placeholder='Search' />
                <img src={search} />
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
