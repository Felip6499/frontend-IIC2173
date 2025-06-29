import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAdminStocks, createOffer } from '../../utils/api';

function MyStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState({});
  const { getAccessTokenSilently } = useAuth0();

  const fetchAdminStocks = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getAdminStocks(token);
      setStocks(data || []);
    } catch (error) {
      console.error("Error fetching admin stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStocks();
  }, []);

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
      alert(`Error al crear la oferta: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) return <div>Cargando mis acciones...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mis Acciones para Subastar</h1>
      {stocks.map(stock => (
        <div key={stock.symbol} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <h2>{stock.symbol} ({stock.longName})</h2>
          <p>Cantidad disponible: {stock.quantity}</p>
          <input
            type="number"
            placeholder="Cantidad a ofrecer"
            value={offering[stock.symbol] || ''}
            onChange={(e) => setOffering({ ...offering, [stock.symbol]: e.target.value })}
          />
          <button onClick={() => handleOffer(stock.symbol)}>Subastar</button>
        </div>
      ))}
    </div>
  );
}

export default MyStocks;