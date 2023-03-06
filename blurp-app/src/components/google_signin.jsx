import React, { useState, useEffect, useRef } from 'react';
import x_button from '../assets/x_button.svg';
import { useCookies } from 'react-cookie';
// import { FRONTEND_URL, BACKEND_URL } from '../constants/constants';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import TempMessage from './temp_msg_display';

// Redirect after logging in
// const BACKEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'https://blurp-app.herokuapp.com';

function GoogleLoginButton(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [renderedContent, setRenderedContent] = useState(signInButton());
  const [popoutVisible, setPopoutVisible] = useState(false);
  const expanded_div_ref = useRef(null);
  const profile_pic_ref = useRef(null);
  const msgRef = useRef(null);
  const [showFailMessage, setShowFailMessage] = useState(false);


  // Collapse popout if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        expanded_div_ref.current &&
        !expanded_div_ref.current.contains(event.target) &&
        profile_pic_ref.current &&
        !profile_pic_ref.current.contains(event.target)
      ) {
        closePopout();
      }
    };
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [closePopout]);

  // If the popout visibility changes, update what's rendered
  useEffect(() => {
    // If the user is logged in, render logged-in page
    if (cookies.loggedIn == 'true') {
      setRenderedContent(userProfile());
    } else {
      setRenderedContent(signInButton());
    }
  }, [popoutVisible, cookies.loggedIn]);

  // When the profile is clicked, switch the popout.
  // If expanded, collapse, and vice versa.
  function handle_profile_click() {
    if (popoutVisible) {
      setPopoutVisible(false);
    } else {
      setPopoutVisible(true);
    }
  }

  // Close the popout that appears when user clicks on
  // their profile picture
  function closePopout() {
    setPopoutVisible(false);
  }

  // When the user clicks logout
  async function logout() {
    fetch(BACKEND_URL + '/login/google/logout', {
      credentials: 'include',
    }).then(res => res.json()).then(res => {
      if(res.success) {
        removeCookie('loggedIn');
        removeCookie('userName');
        removeCookie('profileUrl');
        removeCookie('connect.sid');
        msgRef.current.showMessage('Logout successful');
      }
      else {
        msgRef.current.showMessage('Failed to log out');
      }
    }).catch((err) => {
      msgRef.current.showMessage('Failed to log out');
    });
  }

  async function onLoginSuccess(codeResponse) {
    let accessToken = codeResponse.access_token;
    // Send the access token to the back end
    const response = await fetch(`${BACKEND_URL}/login/google?accessToken=${accessToken}`, {
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      let success = res.success;
      // If successfully authenticated user profile in backend
      if(success) {
        setCookie('loggedIn', 'true', {maxAge: res.maxAge});
        setCookie('userName', res.userName, {maxAge:res.maxAge});
        setCookie('profileUrl', res.profileUrl, {maxAge: res.maxAge});
        msgRef.current.showMessage('Login successful');
      } else {
        msgRef.current.showMessage('Failed to log in');
      }
    });
    setPopoutVisible(false);
  }

  const signIn = useGoogleLogin({
    onSuccess: codeResponse => onLoginSuccess(codeResponse),
    onError: error => {msgRef.current.showMessage('Failed to log in');}
  });

  function signInButton() {
    return (
      <>
        <li onClick={() => signIn()} className="btn-navbar sign-in-btn">
          Sign In
        </li>
      </>
    );
  }

  function userProfile() {
    let popoutVisibility = 'invisible';
    if (popoutVisible) popoutVisibility = '';

    return (
      <>
        <li className="cursor-pointer">
          <img
            className="h-9 w-9 rounded-full"
            src={cookies.profileUrl}
            referrerPolicy="no-referrer"
            onClick={handle_profile_click}
            ref={profile_pic_ref}
          />
        </li>
        <div
          className={
            'absolute mt-[120px] flex h-[60px] w-[180px] items-center bg-gray-900/75 ' +
            popoutVisibility
          }
          ref={expanded_div_ref}>
          <div className={'btn-navbar sign-in-btn inline-block align-middle'} onClick={logout}>
            Sign out
          </div>
          <div>
            <img
              src={x_button}
              className="h-9 w-9 cursor-pointer rounded-full hover:border-2 hover:border-blue-300/10 hover:bg-blue-300/25"
              onClick={closePopout}></img>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {renderedContent}
      <div className="absolute inset-y-1/2 inset-x-1/2">
	      <TempMessage ref={msgRef}/>
      </div>
    </>
  );
}

export default GoogleLoginButton;
