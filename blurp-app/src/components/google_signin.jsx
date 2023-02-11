import React, { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import guestPic from '../assets/guest_profile_pic.svg';
import x_button from '../assets/x_button.svg';
import axios from 'axios';
import Cookies from 'universal-cookie';

function GoogleLoginButton (props) {

  // What to render in place of the sign-in button
  const [renderedContent, setRenderedContent] = useState(signInButton());
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const cookies = new Cookies();

  // Load cookies
  if(!user && cookies.get('googleLoginUser')){
    setUser(cookies.get('googleLoginUser'));
  }

  // Update cookies when user/profile change
  useEffect(() => {
    if(user && user != 'null')
      cookies.set('googleLoginUser', user, {path: '/'});
    else
      cookies.remove('googleLoginUser');
  }, [user, profile]);

  // If the user changes, update the profile
  useEffect(() => {
    if(user && user != 'null') {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Basic ${user.access_token}`,
          Accept: 'application/json'
        }
      }).then((res) => {
        setProfile(res.data);
      }).catch((err) => console.log(err));
    }
    else {
      setProfile(null);
    }
  }, [user]);

  // If the profile changes (logged in, logged out, image change, etc),
  // then we should change what is rendered
  useEffect(() => {
    if(profile && profile != 'null')
      setRenderedContent(userProfile(false));
    else
      setRenderedContent(signInButton);
  }, [profile]);

  function onLoginSuccess(googleUser) {
    setUser(googleUser);
  }
  
  const onLoginFailure = (error) => {
    console.log("Google sign-in failed.");
  }

  // Close the popout that appears when user clicks on
  // their profile picture
  function closePopout () {
    setRenderedContent(userProfile(false));
  }

  // Expand the popout that appears when user clicks on
  // their profile picture
  function expandPopout () {
    setRenderedContent(userProfile(true));
  }

  const login = useGoogleLogin({
    onSuccess: codeResponse => onLoginSuccess(codeResponse),
    onError: error => onLoginFailure(error)
  });

  // When the user clicks logout
  function logout () {
    googleLogout();
    setUser(null);
    setProfile(null);
    cookies.remove('googleLoginUser');
  }
  
  function signInButton () {
    return (
      <>
        <li onClick={() => login()} className='btn-navbar sign-in-btn'>Sign In</li>
      </>
    );
  }

  function userProfile (popoutVisible=false) {

    let popoutVisibility = 'invisible';
    if(popoutVisible)
      popoutVisibility = '';

    let imageUrl = guestPic;
    if(profile && profile.picture)
      imageUrl = profile.picture;

    return (
      <>
        <li className="cursor-pointer">
          <img className="w-9 h-9 rounded-full" src={imageUrl} onClick={expandPopout}/>
        </li>
        <div className={'absolute flex items-center mt-[120px] w-[180px] h-[60px] bg-gray-900/75 ' + popoutVisibility}>
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