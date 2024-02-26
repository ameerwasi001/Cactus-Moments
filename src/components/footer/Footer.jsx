import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { footerSend, facebook, instagram, linkedIn, } from '../../assets'
import './footer.css'
import { getKey, delKey } from '../../requests'

export default function Footer() {
    const navigate = useNavigate()
    const [render, setRender] = useState(0)

    const rerender = () => setRender(render+1)

    return (
        <div className='cactus-footerTopView'>
            <div className='cactus-footerContainer' >
                <div className='cactus-footerItemTopView'>
                    <h1>À propos de nous</h1>
                    {/* <h4>Logo</h4> */}
                    <p>Faites de chaque cadeau un souvenir inoubliable en consultant notre boutique de cadeaux personnalisés. Que ce soit pour un anniversaire, un mariage, une fête de naissance, un EVG ou tout simplement pour montrer votre amour, nos cadeaux sur mesure sont la solution parfaite. Choisissez parmi une variété d'options pour créer des articles uniques qui laisseront une impression durable.</p>
                    <div className='cactus-footerSocialView'>
                        <img src={facebook} alt='' onClick={() => window.open("https://www.facebook.com/mycactusmoments", "_blank")}/>
                        {/* <img src={linkedIn} alt='' onClick={() => window.open("https://www.instagram.com/mycactusmoments", "_blank")}/> */}
                        <img src={instagram} alt='' onClick={() => window.open("https://www.instagram.com/mycactusmoments", "_blank")}/>
                    </div>
                </div>
                <div className='cactus-footerItemTopView margin100'>
                    <h1>Site Web</h1>
                    <h2 onClick={() => navigate('/')}>Accueil</h2>
                    <h2 onClick={() => navigate('/aboutus')}>À propos de nous </h2>
                    <h2 onClick={() => navigate('/poster')}>Posters</h2>
                    <h2 onClick={() => navigate('/privacypolicy')}> Politique de confidentialité </h2>
                    <h2 onClick={() => navigate('/terms')}>Termes et conditions</h2>
                    {getKey('vendor') && <h2 onClick={() => navigate('/loginAsVendor')}>Commandes</h2>}
                    <h2 onClick={() => {
                        const isVendor = getKey('vendor')
                        if(isVendor) navigate('/loginAsVendor?logout')
                        else navigate('/loginAsVendor')
                    }}>{getKey('vendor') ? 'Se déconnecter du compte magasin' : 'Connexion au compte magasin'}</h2>
                </div>
                <div className='cactus-footerItemTopView'>
                    <h1 style={{ marginBottom: 5 }}>Aide</h1>
                    <h2 onClick={() => navigate('/contactus')}>Contactez-nous</h2>
                    <div className='cactus-footer-input_text_view'>
                        <input placeholder='Email address' />
                        <img src={footerSend} alt={''} />
                    </div>
                </div>
            </div>
            <h3>Cactus Moments</h3>
        </div>
    )
}
