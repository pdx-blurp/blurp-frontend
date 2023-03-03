import logo_image from '../assets/blurp_purplebrain_transparent.png';
import navbar_logo_text from '../assets/blurp_text_white.png';
import { Link } from 'react-router-dom';
import GoogleLoginButton from './google_signin';

function NavbarProp() {
  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center bg-gray-900/75 px-4 py-2 shadow-2xl">
        <Link to="/">
          <div className="mx-2 flex flex-shrink-0 cursor-pointer items-center">
            <img className="mr-2 h-[23px] w-[28px]" src={logo_image} alt="Home Page" />
            <img className="h-[25px] w-[64px]" src={navbar_logo_text} alt="blurp logo text" />
          </div>
        </Link>
        <ul className="hidden flex-1 flex-row items-center justify-end gap-8 text-xs uppercase md:flex">
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
        <div className="flex flex-1 justify-end md:hidden">
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
