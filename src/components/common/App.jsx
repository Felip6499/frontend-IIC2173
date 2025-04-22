import React from 'react'
import ReactDOM from 'react-dom/client'
import Routing from './Routing'
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from "@auth0/auth0-react";

function App() {


  return (
    <>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "openid profile email"
        }}
      >
        <Routing/>
      </Auth0Provider>
    </>
  )
}

export default App
