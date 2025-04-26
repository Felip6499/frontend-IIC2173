import React from "react";
import { useNavigate } from "react-router-dom";

function StockPreview({ stock }) {
  const navigate = useNavigate();
  const { symbol, longName, price, variation = 0 } = stock;

  const variationColor = variation >= 0 ? "var(--green)" : "var(--red)";
  const formattedVariation =
    variation >= 0 ? `+${variation}%` : `${variation}%`;

  return (
    <div
      style={{
        backgroundColor: "var(--border)",
        padding: "1rem",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/stocks/${symbol}`)}
    >
      <div>
        <h2 style={{ margin: 0 }}>{symbol}</h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>{longName}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ margin: 0, fontSize: "1.2rem" }}>${price.toFixed(0)}</p>
        <p style={{ margin: 0, color: variationColor }}>{formattedVariation}</p>
      </div>
    </div>
  );
}

export default StockPreview;
