import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  getUserPurchases,
  updateUserMoney,
} from "../../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function Wallet() {
  const navigate = useNavigate();
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading: authLoading,
    loginWithRedirect,
  } = useAuth0();

  const [balance, setBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const token = await getAccessTokenSilently();
        const userInfo = await getUserProfile(token);
        const userPurchases = await getUserPurchases(token);

        setBalance(userInfo.money || 0);

        const sortedPurchases = (userPurchases || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setPurchases(sortedPurchases);
      } catch (error) {
        console.error("Error cargando datos de Wallet:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, [getAccessTokenSilently]);

  const handleAddFunds = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    const amountToAdd = parseInt(addAmount, 10);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      alert("Ingresa una cantidad válida mayor a 0");
      return;
    }

    try {
      const newBalance = balance + amountToAdd;
      const token = await getAccessTokenSilently();
      await updateUserMoney(newBalance, token);
      setBalance(newBalance);
      setAddAmount("");
    } catch (error) {
      console.error("Error al actualizar el dinero:", error);
    }
  };

  if (authLoading || loading) {
    return <div style={{ padding: "2rem" }}>Cargando Wallet...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "2rem" }}>
        Mi Wallet
      </h1>

      <div
        style={{
          backgroundColor: "var(--border)",
          padding: "1.5rem",
          borderRadius: "10px",
          marginBottom: "2rem",
        }}
      >
        <h2>Saldo disponible:</h2>
        <p style={{ fontSize: "2rem", margin: 0 }}>
          ${balance.toLocaleString()}
        </p>

        <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <input
            type="number"
            min="1"
            placeholder="Cantidad a recargar"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid var(--accent-yellow)",
              backgroundColor: "transparent",
              color: "var(--text-light)",
            }}
          />
          <button
            onClick={handleAddFunds}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "var(--accent-yellow)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Recargar
          </button>
        </div>
      </div>

      <h2>Mis Compras</h2>

      {purchases.length === 0 ? (
        <p>No has comprado acciones aún.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {purchases.map((purchase, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "var(--border)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/stocks/${purchase.symbol}`)}
            >
              <div>
                <p style={{ margin: 0 }}>
                  <strong>{purchase.symbol}</strong> — {purchase.quantity}{" "}
                  acciones
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {new Date(purchase.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    color:
                      purchase.status === "ACCEPTED"
                        ? "var(--green)"
                        : "var(--red)",
                  }}
                >
                  {purchase.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wallet;
