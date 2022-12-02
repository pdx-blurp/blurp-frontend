import logo_image from '../assets/t_logo.png'
import profile_pic from '../assets/chubby_yellow_duck.png'
import { Link } from 'react-router-dom'

function NavbarProp() {
    return (
        <>
            <nav class="flex items-center px-4 py-2 bg-blue-900/75 shadow-2xl">
                <Link to="/">
                    <div class="cursor-pointer mx-2 flex items-center flex-shrink-0">
                        <img class="mr-4 h-8 w-8" src={logo_image} alt="" />
                        <div class="font-mono text-xl font-semibold tracking-wider text-white">Tredagle</div>
                    </div>
                </Link>
                <ul class="hidden md:flex flex-row flex-1 justify-end items-center gap-8 uppercase text-xs">
                    <li class="btn-navbar">Shop</li>
                    <li class="btn-navbar">About Us</li>
                    <li class="btn-navbar">Contact</li>
                    <li class="cursor-pointer">
                        <img class="w-9 h-9 rounded-full"src={profile_pic}/>
                    </li>
                </ul>
                <div class="flex md:hidden flex-1 justify-end">
                    <div class="cursor-pointer space-y-2">
                        <div class="my-style"></div>
                        <div class="my-style"></div>
                        <div class="my-style"></div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default NavbarProp