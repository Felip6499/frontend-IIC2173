import React from 'react';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function Main() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated) return;
  
      try {
        const token = await getAccessTokenSilently();
        const claims = await getIdTokenClaims();
        const email = claims.email;
  
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/user`,
          { email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Usuario sincronizado con backend");
      } catch (err) {
        console.error("Error al sincronizar usuario:", err.response || err);
      }
    };
  
    syncUser();
  }, [isAuthenticated, getAccessTokenSilently]);



  if (isLoading) return <p>⏳ Cargando sesión...</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {isAuthenticated ? (
        <>
          <h2>Bienvenido, {user.name}</h2>
          <p>{user.email}</p>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <h2>Bienvenido al sistema</h2>
          <button onClick={() => loginWithRedirect()}>Iniciar sesión</button>
          <br /><br />
          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  screen_hint: 'signup',
                },
              })
            }
          >
            Crear cuenta
          </button>
        </>
      )}
    </div>
  );
}

export default Main;
