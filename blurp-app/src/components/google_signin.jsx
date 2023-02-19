import React, { useState, useEffect, useRef } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import guestPic from '../assets/guest_profile_pic.svg';
import x_button from '../assets/x_button.svg';
import axios from 'axios';
import Cookies from 'universal-cookie';

function GoogleLoginButton (props) {

  // What to render in place of the sign-in button
  const [renderedContent, setRenderedContent] = useState(signInButton());
  const [profile, setProfile] = useState(null);
  const [popoutVisible, setPopoutVisible] = useState(false);
  const cookies = new Cookies();
  const expanded_div_ref = useRef(null);
  const profile_pic_ref = useRef(null);

  // Use token to retrieve profile data
  function retrieveProfile () {
    if(cookies.get('a_t'))
    {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${cookies.get('a_t')}`, {
        headers: {
          Authorization: `Basic ${cookies.get('a_t')}`,
          Accept: 'application/json'
        }
      }).then((res) => {
        setProfile(res.data);
      }).catch((err) => console.log(err));
    }
    else {
      setProfile(null);
    }
  }
  retrieveProfile();

  // If the profile changes (logged in, logged out, image change, etc),
  // then we should change what is rendered
  useEffect(() => {
    if(profile && profile != 'null') {
      setPopoutVisible(false);
      setRenderedContent(userProfile());
    }
    else {
      setRenderedContent(signInButton);
    }
  }, [profile]);

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
    if(profile && profile != 'null') {
      setRenderedContent(userProfile());
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
    googleLogout();
    setProfile(null);
    cookies.remove('a_t');
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
    if(profile && profile.picture)
      imageUrl = profile.picture;
      
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
