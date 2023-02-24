import React, { useState, useEffect, useRef } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import guestPic from '../assets/guest_profile_pic.svg';
import x_button from '../assets/x_button.svg';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { StepConnector } from '@mui/material';

function GoogleLoginButton (props) {

  const [cookies, setCookie,  removeCookie] = useCookies();
  const [renderedContent, setRenderedContent] = useState(signInButton());
  const [popoutVisible, setPopoutVisible] = useState(false);
  const expanded_div_ref = useRef(null);
  const profile_pic_ref = useRef(null);
  const [rerenderVar, setRerenderVar] = useState(false);
  let loggedIn = false;
  let profilePicUrl = null;
  
  // If there's a connect.sid cookie and the user is logged in,
  // then load the page as though the user is logged in.
  if(cookies['connect.sid'] && cookies['loggedIn'] == 'true') {
    loggedIn = true;
    profilePicUrl = cookies['profilePicUrl'];
  }

  function rerender() {
    setRerenderVar(!rerenderVar);
  }

  // Collapse popout if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if(expanded_div_ref.current && !expanded_div_ref.current.contains(event.target) &&
        profile_pic_ref.current && !profile_pic_ref.current.contains(event.target)) {
        closePopout();
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [closePopout]);
  
  // If the popout visibility changes, update what's rendered
  useEffect(() => {
    if(loggedIn) {
      setRenderedContent(userProfile());
    }
    else {
      setRenderedContent(signInButton());
    }
  }, [popoutVisible])
  
  // When the profile is clicked, switch the popout.
  // If expanded, collapse, and vice versa.
  function handle_profile_click () {
    if(popoutVisible) {
      setPopoutVisible(false);
    }
    else {
      setPopoutVisible(true);
    }
  }

  // Close the popout that appears when user clicks on
  // their profile picture
  function closePopout () {
    setPopoutVisible(false);
  }

  // When the user clicks logout
  async function logout () {
    await fetch('http://localhost:3000/login/google/logout', {credentials: 'include'});
    console.log('logged outt');
    setRenderedContent(signInButton());
  }

  function signIn() {
    // Redirect to sign in
    window.location.href = 'http://localhost:3000/login/google';
  }
  
  function signInButton () {
    return (
      <>
        <li onClick={() => signIn()} className='btn-navbar sign-in-btn'>Sign In</li>
      </>
    );
  }
  
  function userProfile () {

    let popoutVisibility = 'invisible';
    if(popoutVisible)
      popoutVisibility = '';
      
    return (
      <>
        <li className="cursor-pointer">
          <img className="w-9 h-9 rounded-full" src={profilePicUrl} onClick={handle_profile_click} ref={profile_pic_ref}/>
        </li>
        <div className={'absolute flex items-center mt-[120px] w-[180px] h-[60px] bg-gray-900/75 ' + popoutVisibility}  ref={expanded_div_ref}>
          <div className={'btn-navbar sign-in-btn inline-block align-middle'} onClick={logout}>
            Sign out
          </div>
          <div>
            <img src={x_button} className='cursor-pointer w-9 h-9 rounded-full hover:border-2 hover:border-blue-300/10 hover:bg-blue-300/25' onClick={closePopout}></img>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      {renderedContent}
    </>
  );
}

export default GoogleLoginButton;
