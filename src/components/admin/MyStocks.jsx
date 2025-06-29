import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAdminStocks, createOffer } from "../../utils/api";

function MyStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  const fetchAdminStocks = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const data = await getAdminStocks(token);
      setStocks(data || []);
    } catch (error) {
      console.error("Error fetching admin stocks:", error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchAdminStocks();
  }, [fetchAdminStocks]);

  const handleOffer = async (symbol) => {
    const quantity = parseInt(offering[symbol], 10);
    if (!quantity || quantity <= 0) {
      alert("Por favor, ingresa una cantidad válida.");
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await createOffer(symbol, quantity, token);
      alert("¡Oferta creada con éxito!");
      fetchAdminStocks();
      setOffering({});
    } catch (error) {
      alert(
        `Error al crear la oferta: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}
      >
        Cargando mis acciones...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "1rem" }}>
        Mis Acciones para Subastar
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            style={{
              backgroundColor: "var(--border)",
              padding: "1rem 2rem",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 0.5rem 0" }}>
                {stock.symbol} ({stock.longName})
              </h2>
              <p style={{ margin: 0 }}>Cantidad disponible: {stock.quantity}</p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <input
                type="number"
                placeholder="Cantidad a ofrecer"
                min="1"
                value={offering[stock.symbol] || ""}
                onChange={(e) =>
                  setOffering({ ...offering, [stock.symbol]: e.target.value })
                }
                style={{
                  width: "120px",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid var(--accent-yellow)",
                  backgroundColor: "transparent",
                  color: "var(--text-light)",
                  textAlign: "right",
                }}
              />

              <button
                onClick={() => handleOffer(stock.symbol)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "var(--accent-yellow)",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Subastar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyStocks;
