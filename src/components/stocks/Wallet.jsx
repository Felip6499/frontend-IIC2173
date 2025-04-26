import React, { useState } from "react";

function Wallet() {
  const [balance, setBalance] = useState(10000); // Mock inicial de saldo
  const [purchases] = useState([
    // Mock de compras realizadas
    { symbol: "AAPL", quantity: 2, price: 150 },
    { symbol: "GOOGL", quantity: 1, price: 2700 },
  ]);

  const handleAddFunds = () => {
    setBalance(balance + 1000); // Mock: agregar $1000
  };

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
        <button
          onClick={handleAddFunds}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "var(--accent-yellow)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Recargar $1000
        </button>
      </div>

      <h2>Mis compras</h2>

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
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>{purchase.symbol}</strong> — {purchase.quantity}{" "}
                acciones a ${purchase.price.toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wallet;
