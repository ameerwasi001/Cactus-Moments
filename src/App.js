import React from 'react'
import { BrowserRouter } from "react-router-dom";
import './App.css'
import 'react-slideshow-image/dist/styles.css'
import Navigation from './navigation/Navigation';

const App = () => {
    return (
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>
    )
}

export default App
