import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'

function EcomapperRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={/*landing page here */ }/>
                <Route path="" element={/*map tool page here*/ }/>
            </Routes>
        </BrowserRouter>
    )
    
}

export default EcomapperRoutes