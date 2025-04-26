import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllStocks, buyStock } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import symbolToDomain from "../../utils/symbolToDomain";
import ModalCompra from "../../components/common/ModalCompra";

const ITEMS_PER_PAGE = 6;

function StockMarket() {
  const {
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    isLoading: authLoading,
  } = useAuth0();
  const [stocks, setStocks] = useState([]);
  const [buying, setBuying] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState({
    open: false,
    success: false,
    quantity: 0,
    unitPrice: 0,
    symbol: "",
    logoUrl: "",
    errorMessage: "",
  });

  const navigate = useNavigate();

  async function fetchStocks(page = 1) {
    setLoading(true);
    const data = await getAllStocks(page, ITEMS_PER_PAGE);
    setStocks(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStocks(currentPage);
  }, [currentPage]);

  const handleBuy = async (symbol) => {
    if (!buying[symbol]) return;

    if (!isAuthenticated) {
      setMessage("Debes iniciar sesión para comprar.");
      loginWithRedirect();
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const quantity = parseInt(buying[symbol], 10);
      await buyStock(symbol, quantity, token);
      const stockData = stocks.find((s) => s.symbol === symbol);
      setModalData({
        open: true,
        success: true,
        quantity,
        unitPrice: stockData.price,
        symbol,
        logoUrl: symbolToDomain[symbol]
          ? `https://logo.clearbit.com/${symbolToDomain[symbol]}`
          : "",
        errorMessage: "",
      });

      setBuying({});
    } catch (err) {
      console.error("Error al comprar:", err.response?.data || err);

      setModalData({
        open: true,
        success: false,
        quantity: 0,
        unitPrice: 0,
        symbol,
        logoUrl: symbolToDomain[symbol]
          ? `https://logo.clearbit.com/${symbolToDomain[symbol]}`
          : "",
        errorMessage: err.response?.data?.error || "Error interno",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}
      >
        Cargando mercado de acciones...
      </div>
    );
  }

  const currentStocks = stocks;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "2rem" }}>
        Mercado de Acciones
      </h1>

      {message && (
        <div
          style={{
            backgroundColor: "var(--border)",
            color: "var(--text-light)",
            padding: "1rem",
            marginBottom: "2rem",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {currentStocks.map((stock) => (
          <div
            key={stock.symbol}
            style={{
              backgroundColor: "var(--border)",
              padding: "1rem 2rem",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {symbolToDomain[stock.symbol] && (
                <img
                  src={`https://logo.clearbit.com/${
                    symbolToDomain[stock.symbol]
                  }`}
                  alt={stock.symbol}
                  style={{ width: "36px", height: "36px", borderRadius: "6px" }}
                />
              )}
              <div>
                <h2 style={{ margin: "0 0 0.5rem 0" }}>{stock.symbol}</h2>
                <p style={{ color: "var(--text-muted)", margin: 0 }}>
                  {stock.longName}
                </p>
                <p style={{ fontSize: "1.2rem", margin: "1rem 0" }}>
                  Precio: ${stock.price.toFixed(0)}
                </p>
                <p style={{ margin: 0 }}>
                  Cantidad disponible: {stock.quantity}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                value={buying[stock.symbol] || ""}
                onChange={(e) =>
                  setBuying({ ...buying, [stock.symbol]: e.target.value })
                }
                style={{
                  width: "120px",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid var(--accent-yellow)",
                  backgroundColor: "transparent",
                  color: "var(--text-light)",
                  marginBottom: "0.5rem",
                  textAlign: "right",
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuy(stock.symbol);
                }}
                style={{
                  width: "130px",
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
        ))}
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor:
              currentPage === 1 ? "gray" : "var(--accent-yellow)",
            border: "none",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Anterior
        </button>
        <button
          disabled={stocks.length < ITEMS_PER_PAGE || stocks.length === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor:
              stocks.length < ITEMS_PER_PAGE || stocks.length === 0
                ? "gray"
                : "var(--accent-yellow)",
            border: "none",
            cursor:
              stocks.length < ITEMS_PER_PAGE || stocks.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>

      <ModalCompra
        isOpen={modalData.open}
        onClose={async () => {
          setModalData({ ...modalData, open: false });
          await fetchStocks(currentPage);
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

export default StockMarket;
