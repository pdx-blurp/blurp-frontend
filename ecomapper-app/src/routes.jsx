import {BrowserRouter, Routes, Route} from 'react-router-dom';

function EcomapperRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                {/* this is left as an exercise for you to learn how to hook up pages */}
                <Route index element={/*landing page here */ }/>
                <Route path="" element={/*map tool page here*/ }/>
            </Routes>
        </BrowserRouter>
    )
}

export default EcomapperRoutes