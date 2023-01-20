import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import BlurpMap from './pages/blurpmap.jsx';
import TestPage from './pages/testpage.jsx';

export default function BlurpRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* this is left as an exercise for you to learn how to hook up pages */}
        <Route index element={<Home />} />
        <Route path="/blurpmap" element={<BlurpMap />} />
        <Route path="/test-page" element={<TestPage />} />
        {/* <Route path="" element={ map tool page here}/> */}
      </Routes>
    </BrowserRouter>
  );
}
