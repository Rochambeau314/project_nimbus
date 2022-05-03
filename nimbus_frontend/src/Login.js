
import React, { useEffect, useCallback, useContext } from 'react';
import ReactDOM from 'react-dom';
import GoogleButton from 'react-google-button'

function Login() {
  /*async () => {
    const session_id = await Google;
  }*/
  // backend returns the session id here, which is then set 
  // frontend senses when session id is returned, and then redirects when it occurs (logged in)
  // calls with session id to see if user has a profile or not 
  // profile exists = redirect to home, no profile = redirect to create profile, which then redirects to home 

  //Google Login function 
    const openGoogleLoginPage = useCallback(() => {
        const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const redirectUri = 'GoogleOAuth'; 
      
        const scope = [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ');
      
        const params = {
          response_type: 'code',
          client_id: '1004886906155-d7b2r83i0u8d7ks1bvv1b6rgrdp673gk.apps.googleusercontent.com',
          redirect_uri: `${'https://idlehands.pythonanywhere.com'}/${redirectUri}`,
          prompt: 'select_account',
          access_type: 'offline',
        };
      
        const urlParams = new URLSearchParams(params).toString();
      
        window.location = `${googleAuthUrl}?${urlParams}`;
      }, []);

    return(
        <div className="login">
            <GoogleButton style={{margin: "auto"}} onClick={openGoogleLoginPage}/>
        </div>
    )
}

export default Login
