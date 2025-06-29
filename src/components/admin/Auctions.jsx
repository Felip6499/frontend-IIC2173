import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getOffers, createProposal, getAdminStocks } from "../../utils/api";

function Auctions() {
  const [offers, setOffers] = useState([]);
  const [myStocks, setMyStocks] = useState([]);
  const [proposal, setProposal] = useState({});
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const offersData = await getOffers(token);
      const myStocksData = await getAdminStocks(token);
      setOffers(offersData.filter((o) => String(o.group_id) !== "22"));
      setMyStocks(myStocksData || []);
    } catch (error) {
      console.error("Error fetching data for auctions:", error);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProposal = async (auction_id) => {
    const { symbol, quantity } = proposal[auction_id] || {};
    if (!symbol || !quantity || quantity <= 0) {
      alert("Selecciona un stock y una cantidad válida.");
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await createProposal(auction_id, symbol, parseInt(quantity, 10), token);
      alert("Propuesta enviada con éxito.");
      setProposal({});
      await fetchData(); // Opcional: refresca datos después de propuesta
    } catch (error) {
      alert(
        `Error al enviar la propuesta: ${
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
        Cargando subastas...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "1rem" }}>
        Subastas de Otros Grupos
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {offers.map((offer) => (
          <div
            key={offer.auction_id}
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
                Grupo {offer.group_id} ofrece {offer.quantity} de{" "}
                <strong>{offer.symbol}</strong>
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <select
                value={proposal[offer.auction_id]?.symbol || ""}
                onChange={(e) =>
                  setProposal({
                    ...proposal,
                    [offer.auction_id]: {
                      ...proposal[offer.auction_id],
                      symbol: e.target.value,
                    },
                  })
                }
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid var(--accent-yellow)",
                  backgroundColor: "transparent",
                  color: "var(--text-light)",
                }}
              >
                <option value="">Selecciona tu stock</option>
                {myStocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} ({s.quantity} disp.)
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                min="1"
                value={proposal[offer.auction_id]?.quantity || ""}
                onChange={(e) =>
                  setProposal({
                    ...proposal,
                    [offer.auction_id]: {
                      ...proposal[offer.auction_id],
                      quantity: e.target.value,
                    },
                  })
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
                onClick={() => handleProposal(offer.auction_id)}
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "var(--accent-yellow)",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Proponer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auctions;
