import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllStocks, initiatePayment} from "../../utils/api";
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

  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [buying, setBuying] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
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

  async function fetchStocks() {
    const token = await getAccessTokenSilently();
    setLoading(true);
    const data = await getAllStocks(1, 25, token);
    setAllStocks(data);
    setFilteredStocks(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    let filtered = allStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stock.longName.toLowerCase().includes(search.toLowerCase())
    );

    if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "date-asc") {
      filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOption === "date-desc") {
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    setFilteredStocks(filtered);
    setCurrentPage(1);
  }, [search, sortOption, allStocks]);

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
        // Construir el formulario dinámicamente
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

  if (authLoading || loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}
      >
        Cargando mercado de acciones...
      </div>
    );
  }

  const indexOfLastStock = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstStock = indexOfLastStock - ITEMS_PER_PAGE;
  const currentStocks = filteredStocks.slice(
    indexOfFirstStock,
    indexOfLastStock
  );
  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "1rem" }}>
        Mercado de Acciones
      </h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por símbolo o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid var(--accent-yellow)",
            backgroundColor: "transparent",
            color: "var(--text-light)",
          }}
        />
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid var(--accent-yellow)",
            backgroundColor: "var(--border)",
            color: "var(--accent-yellow)",
            marginBottom: "1rem",
          }}
        >
          <option value="date-desc">Fecha (más reciente primero)</option>
          <option value="date-asc">Fecha (más antigua primero)</option>
          <option value="price-asc">Precio (menor a mayor)</option>
          <option value="price-desc">Precio (mayor a menor)</option>
        </select>
      </div>

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
                  Precio: ${stock.price.toLocaleString()}
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
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            backgroundColor:
              currentPage === totalPages ? "gray" : "var(--accent-yellow)",
            border: "none",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>

      <ModalCompra
        isOpen={modalData.open}
        onClose={async () => {
          setModalData({ ...modalData, open: false });
          await fetchStocks();
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
