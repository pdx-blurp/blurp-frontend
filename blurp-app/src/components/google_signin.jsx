import React, { useState, useRef } from 'react';
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import guestPic from '../assets/guest_profile_pic.svg';
import x_button from '../assets/x_button.svg';

// IMPORTANT!!!
// The gapi import below is needed even though VSCode shows it
// as useless. Google OAuth doesn't work without it.
import { gapi } from 'gapi-script';
// DO NOT REMOVE THE ABOVE IMPORT!

function GoogleLoginButton (props) {

  // What to render in place of the sign-in button
  const [renderedContent, setRenderedContent] = useState(signInButton());
  let current_user = null;

  const onLoginSuccess = (googleUser) => {
    console.log(googleUser);
    // Set content to be logout button
    current_user = googleUser;
    setRenderedContent(userProfile());
  }
  
  const onLoginFailure = (error) => {
    alert("Google sign-in won't work. Enable third-party cookies in your browser.");
  }

  const onLogoutSuccess = (googleUser) => {
    setRenderedContent(signInButton());
    console.log(googleUser);
  }

  function closePopout () {
    setRenderedContent(userProfile(false));
  }

  function expandPopout () {
    setRenderedContent(userProfile(true));
    console.log('expandPopout');
  }
  
  function signInButton () {
    return (
      <>
        <GoogleLogin onSuccess={(googleUser) => {onLoginSuccess(googleUser)}}
            onFailure={(error) => {onLoginFailure(error);}}
            render={renderProps => (
              <li onClick={renderProps.onClick} className='btn-navbar sign-in-btn'>Sign In</li>
              )}
              responseType='user'
              cookiePolicy='single_host_origin'
            >
          </GoogleLogin>
      </>
    );
  }

  function userProfile (popoutVisible=false) {

    let popoutVisibility = 'invisible';
    if(popoutVisible)
      popoutVisibility = '';

    let imageUrl = guestPic;
    if(current_user && current_user.profileObj && current_user.profileObj.imageUrl)
      imageUrl = current_user.profileObj.imageUrl;

    return (
      <>
        <li className="cursor-pointer">
          <img className="w-9 h-9 rounded-full" src={imageUrl} onClick={expandPopout}/>
        </li>
        {/* <div className='w-[150px] h-[40px] bg-gray-200'> */}
        <GoogleLogout onLogoutSuccess={onLogoutSuccess}
            render={renderProps => (
              <>
                <div className={'absolute flex items-center mt-[120px] w-[180px] h-[60px] bg-gray-900/75 ' + popoutVisibility}>
                  <div className={'btn-navbar sign-in-btn inline-block align-middle'} onClick={renderProps.onClick}>
                    Sign out
                  </div>
                  <div>
                    <img src={x_button} className='cursor-pointer w-9 h-9 rounded-full hover:border-2 hover:border-blue-300/10 hover:bg-blue-300/25' onClick={closePopout}></img>
                  </div>
                </div>
              </>
            )}
            />
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