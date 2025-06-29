import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, user } =
    useAuth0();
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("isAdmin"));
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminStatus = sessionStorage.getItem("isAdmin");
      setIsAdmin(adminStatus);
    };

    if (isAuthenticated) {
      checkAdminStatus();
    }

    window.addEventListener("sessionStorageUpdated", checkAdminStatus);
    return () => {
      window.removeEventListener("sessionStorageUpdated", checkAdminStatus);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAdmin(null);
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

        {isAdmin === "true" && (
          <div
            style={{
              position: "relative",
            }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div
              style={{
                color: "var(--accent-yellow)",
                fontWeight: "bold",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              Admin ▾
            </div>

            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: 0,
                backgroundColor: "var(--bg-dark)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                padding: "0.5rem 0",
                minWidth: "180px",
                zIndex: 1000,
                display: showDropdown ? "block" : "none",
              }}
            >
              <Link
                to="/admin/my-stocks"
                style={{
                  display: "block",
                  padding: "0.6rem 1rem",
                  color: "var(--text-light)",
                  textDecoration: "none",
                }}
              >
                Mis Stocks
              </Link>
              <Link
                to="/admin/auctions"
                style={{
                  display: "block",
                  padding: "0.6rem 1rem",
                  color: "var(--text-light)",
                  textDecoration: "none",
                }}
              >
                Subastas
              </Link>
              <Link
                to="/admin/proposals"
                style={{
                  display: "block",
                  padding: "0.6rem 1rem",
                  color: "var(--text-light)",
                  textDecoration: "none",
                }}
              >
                Propuestas
              </Link>
            </div>
          </div>
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
                  fontWeight: "bold",
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
                fontWeight: "bold",
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
