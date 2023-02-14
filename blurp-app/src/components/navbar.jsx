import logo_image from '../assets/blurp_purplebrain.png';
import { Link } from 'react-router-dom';
import GoogleLoginButton from './google_signin';

function NavbarProp() {
  return (
    <>
      <nav className="flex items-center sticky top-0 z-50 px-4 py-2 bg-gray-900/75 shadow-2xl">
        <Link to="/">
          <div className="cursor-pointer mx-2 flex items-center flex-shrink-0">
            <img className="mr-4 h-8 w-8" src={logo_image} alt="Home Page" />
            <div className="font-mono text-xl font-semibold tracking-wider text-white">
              blurp
            </div>
          </div>
        </Link>
        <ul className="hidden md:flex flex-row flex-1 justify-end items-center gap-8 uppercase text-xs">
          <Link to="/about">
            <li className="btn-navbar">About Us</li>
          </Link>
          <Link to="/contact">
            <li className="btn-navbar">Contact</li>
          </Link>
          {/* <li className="cursor-pointer">
            <img className="w-9 h-9 rounded-full" src={profile_pic} />
          </li> */}
          {/* <li className='btn-navbar sign-in-btn'>Sign In</li> */}
          <GoogleLoginButton />
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
