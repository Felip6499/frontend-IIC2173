import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } =
    useAuth0();
  const [isAdmin, setIsAdmin] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const adminStatus = sessionStorage.getItem("isAdmin");
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(null);
    }
  }, [isAuthenticated, user, location]);

  const handleLogout = () => {
    sessionStorage.clear();
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav
      style={{
        backgroundColor: "var(--bg-dark)",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            color: "var(--accent-yellow)",
            textDecoration: "none",
            fontSize: "1.7rem",
            fontWeight: "bold",
          }}
        >
          Stockify
        </Link>
        {isAdmin !== null && (
          <>
            <Link
              to="/stocks"
              style={{ color: "var(--text-light)", textDecoration: "none" }}
            >
              Stocks
            </Link>
            <Link
              to="/wallet"
              style={{ color: "var(--text-light)", textDecoration: "none" }}
            >
              Wallet
            </Link>
          </>
        )}
      </div>

      {!isLoading && (
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ color: "var(--text-muted)", marginRight: "1rem" }}>
                {user.name}
              </span>
              <button
                style={{
                  backgroundColor: "var(--accent-yellow)",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              style={{
                backgroundColor: "var(--accent-yellow)",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={() => loginWithRedirect()}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
