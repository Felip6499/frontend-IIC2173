import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getOffers, createProposal, getAdminStocks } from "../../utils/api";

function Auctions() {
  const [offers, setOffers] = useState([]);
  const [myStocks, setMyStocks] = useState([]);
  const [proposal, setProposal] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  const fetchData = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const offersData = await getOffers(token);
      const myStocksData = await getAdminStocks(token);
      setOffers(
        offersData.filter(
          (o) => String(o.group_id) !== process.env.REACT_APP_GROUP_ID
        )
      );
      setMyStocks(myStocksData || []);
    } catch (error) {
      console.error("Error fetching data for auctions:", error);
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
    } catch (error) {
      alert(
        `Error al enviar la propuesta: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Subastas de Otros Grupos</h1>
      {offers.map((offer) => (
        <div
          key={offer.auction_id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            margin: "1rem 0",
          }}
        >
          <p>
            Grupo {offer.group_id} ofrece {offer.quantity} de {offer.symbol}
          </p>
          <div>
            <select
              onChange={(e) =>
                setProposal({
                  ...proposal,
                  [offer.auction_id]: {
                    ...proposal[offer.auction_id],
                    symbol: e.target.value,
                  },
                })
              }
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
              onChange={(e) =>
                setProposal({
                  ...proposal,
                  [offer.auction_id]: {
                    ...proposal[offer.auction_id],
                    quantity: e.target.value,
                  },
                })
              }
            />
            <button onClick={() => handleProposal(offer.auction_id)}>
              Hacer Propuesta
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Auctions;
