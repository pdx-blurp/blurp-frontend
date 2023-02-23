import React, { useState, useEffect, useRef } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import guestPic from '../assets/guest_profile_pic.svg';
import x_button from '../assets/x_button.svg';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { StepConnector } from '@mui/material';

function GoogleLoginButton (props) {

  const [cookies, setCookie,  removeCookie] = useCookies();

  // What to render in place of the sign-in button
  const [renderedContent, setRenderedContent] = useState(signInButton());
  const [popoutVisible, setPopoutVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const expanded_div_ref = useRef(null);
  const profile_pic_ref = useRef(null);
  
  const [profilePic, setProfilePic] = useState(null);
  
  async function isLoggedIn() {
    let result = false;
    await fetch('http://localhost:3000/login/isloggedin', {credentials: 'include'})
      .then((res) => res.json())
      .then(res => {
        if(res == 'true') result = true;
      });
    console.log('logged in 2:', result);
    setLoggedIn(result);
    return result;
  }

  async function fetchProfilePic() {
    let result;
    await fetch('http://localhost:3000/userdata/profilepic', {credentials: 'include'})
      .then((res) => res.json())
      .then(res => {
        result = res;
      });
    console.log('result:', result);
    setProfilePic(result);
    return result;
  }

  async function updateUserLogin() {
    setLoggedIn(await isLoggedIn());
    if(loggedIn) {
      fetchProfilePic();
    }
    else {
      setProfilePic(null);
    }
  }
  
  useEffect(() => {
    updateUserLogin();
  }, [loggedIn]);

  useEffect(() => {
    if(loggedIn) {
      console.log('hereee', profilePic)
      setRenderedContent(userProfile());
    }
    else {
      setRenderedContent(signInButton());
    }
  }, [profilePic]);

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
    setRenderedContent(userProfile());
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
  
  // Expand the popout that appears when user clicks on
  // their profile picture
  function expandPopout () {
    setPopoutVisible(true);
  }
  
  // const login = useGoogleLogin({
  //   onSuccess: codeResponse => onLoginSuccess(codeResponse),
  //   onError: error => onLoginFailure(error)
  // });

  // When the user clicks logout
  function logout () {
    setLoggedIn(false);
  }

  function redirectToSignIn() {
    window.location.href = 'http://localhost:3000/login/google';
  }
  
  function signInButton () {
    return (
      <>
        <li onClick={() => redirectToSignIn()} className='btn-navbar sign-in-btn'>Sign In</li>
      </>
    );
  }
  
  function userProfile () {

    let popoutVisibility = 'invisible';
    if(popoutVisible)
    popoutVisibility = '';

    let imageUrl = guestPic;
    if(profilePic && profilePic != 'error') {
      imageUrl = profilePic;
    }
      
    return (
      <>
        <li className="cursor-pointer">
          <img className="w-9 h-9 rounded-full" src={imageUrl} onClick={handle_profile_click} ref={profile_pic_ref}/>
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
