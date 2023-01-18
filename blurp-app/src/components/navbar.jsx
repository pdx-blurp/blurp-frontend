import logo_image from '../assets/blurp_purplebrain.png';
import profile_pic from '../assets/chubby_yellow_duck.png';
import { Link } from 'react-router-dom';

function NavbarProp() {
  return (
    <>
      <nav className="flex items-center sticky top-0 z-50 px-4 py-2 bg-slate-500/75 shadow-2xl">
        <Link to="/">
          <div className="cursor-pointer mx-2 flex items-center flex-shrink-0">
            <img className="mr-4 h-8 w-8" src={logo_image} alt="Home Page" />
            <div className="font-mono text-xl font-semibold tracking-wider text-white">
              blurp
            </div>
          </div>
        </Link>
        <ul className="hidden md:flex flex-row flex-1 justify-end items-center gap-8 uppercase text-xs">
          <li className="btn-navbar">Shop</li>
          <li className="btn-navbar">About Us</li>
          <li className="btn-navbar">Contact</li>
          <li className="cursor-pointer">
            <img className="w-9 h-9 rounded-full" src={profile_pic} />
          </li>
        </ul>
        <div className="flex md:hidden flex-1 justify-end">
          <div className="cursor-pointer space-y-2">
            <div className="my-style"></div>
            <div className="my-style"></div>
            <div className="my-style"></div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarProp;
