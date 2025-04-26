import React from "react";

function ModalCompra({
  isOpen,
  onClose,
  success,
  logoUrl,
  symbol,
  quantity,
  unitPrice,
  errorMessage,
}) {
  if (!isOpen) return null;

  const totalPrice = unitPrice * quantity;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-dark)",
          padding: "2rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {success ? (
          <>
            {logoUrl && (
              <img
                src={logoUrl}
                alt={symbol}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                }}
              />
            )}
            <h2 style={{ color: "var(--accent-yellow)", marginBottom: "1rem" }}>
              Compra realizada
            </h2>
            <p style={{ margin: 0 }}>
              Acción: <strong>{symbol}</strong>
            </p>
            <p style={{ margin: 0 }}>
              Cantidad: <strong>{quantity}</strong>
            </p>
            <p style={{ margin: 0 }}>
              Precio unitario: <strong>${unitPrice.toLocaleString()}</strong>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              Total: <strong>${totalPrice.toLocaleString()}</strong>
            </p>
          </>
        ) : (
          <>
            <h2 style={{ color: "var(--red)", marginBottom: "1rem" }}>
              Compra rechazada
            </h2>
            <p style={{ color: "var(--text-muted)" }}>{errorMessage}</p>
          </>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "2rem",
            padding: "0.7rem 1.5rem",
            backgroundColor: "var(--accent-yellow)",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default ModalCompra;
