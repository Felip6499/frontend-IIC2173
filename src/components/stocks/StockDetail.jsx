import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStockBySymbol, initiatePayment} from "../../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import symbolToDomain from "../../utils/symbolToDomain";
import ModalCompra from "../../components/common/ModalCompra";

function StockDetail() {
  const { symbol } = useParams();
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } =
    useAuth0();
  const [stock, setStock] = useState(null);
  const [buying, setBuying] = useState({});
  const [modalData, setModalData] = useState({
    open: false,
    success: false,
    quantity: 0,
    unitPrice: 0,
    symbol: "",
    logoUrl: "",
    errorMessage: "",
  });

  const fetchStock = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const stockData = await getStockBySymbol(symbol, token);
      setStock(stockData);
    } catch (error) {
      console.error("Error cargando stock:", error);
      setStock(null);
    }
  }, [symbol]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const handleBuy = async (symbol) => {
    if (!buying[symbol]) return;
  
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
  
    try {
      const token = await getAccessTokenSilently();
      const quantity = parseInt(buying[symbol], 10);
  
      const paymentData = await initiatePayment(symbol, quantity, token);
  
      if (paymentData && paymentData.url && paymentData.token) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentData.url;
  
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = paymentData.token;
  
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      } else {
        console.error("No se recibió una URL de Webpay para la redirección.");
      }
    } catch (err) {
      console.error("Error al iniciar el pago:", err.response?.data || err);
      setModalData({
        open: true,
        success: false,
        quantity: 0,
        unitPrice: 0,
        symbol,
        logoUrl: symbolToDomain[symbol]
          ? `https://logo.clearbit.com/${symbolToDomain[symbol]}`
          : "",
        errorMessage: err.response?.data?.error || "Error al iniciar el pago.",
      });
    }
  };

  if (!stock) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        Cargando detalle de acción...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {symbolToDomain[stock.symbol] && (
          <img
            src={`https://logo.clearbit.com/${symbolToDomain[stock.symbol]}`}
            alt={stock.symbol}
            style={{ width: "48px", height: "48px", borderRadius: "8px" }}
          />
        )}
        <h1 style={{ color: "var(--accent-yellow)", margin: 0 }}>
          {stock.longName} ({stock.symbol})
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 2, minWidth: "500px" }}>
          <img
            src={`https://finviz.com/chart.ashx?t=${symbol}`}
            alt={`Gráfico de ${symbol}`}
            style={{
              width: "100%",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "280px",
            padding: "2rem",
            backgroundColor: "var(--border)",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginTop: 0 }}>
            Precio: ${stock.price.toFixed(0)}
          </p>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--text-muted)",
              marginTop: "0.5rem",
            }}
          >
            Cantidad disponible: {stock.quantity}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="number"
              min="1"
              placeholder="Cantidad"
              value={buying[symbol] || ""}
              onChange={(e) =>
                setBuying({ ...buying, [symbol]: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid var(--accent-yellow)",
                backgroundColor: "transparent",
                color: "var(--text-light)",
                marginBottom: "1rem",
              }}
            />
            <button
              onClick={() => handleBuy(symbol)}
              style={{
                width: "100%",
                padding: "0.6rem",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "var(--accent-yellow)",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Comprar
            </button>
          </div>
        </div>
      </div>

      <ModalCompra
        isOpen={modalData.open}
        onClose={async () => {
          setModalData({ ...modalData, open: false });
          await fetchStock();
        }}
        success={modalData.success}
        logoUrl={modalData.logoUrl}
        symbol={modalData.symbol}
        quantity={modalData.quantity}
        unitPrice={modalData.unitPrice}
        errorMessage={modalData.errorMessage}
      />
    </div>
  );
}

export default StockDetail;
