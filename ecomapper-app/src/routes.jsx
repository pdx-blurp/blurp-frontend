import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';

export default function EcomapperRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* this is left as an exercise for you to learn how to hook up pages */}
        <Route index element={<Home />} />
        {/* <Route path="" element={ map tool page here}/> */}
      </Routes>
    </BrowserRouter>
  );
}
