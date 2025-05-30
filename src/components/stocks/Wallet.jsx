import React, { useEffect, useState } from "react";
import { getEstimations, getUserPurchases } from "../../utils/api";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

function Wallet() {
  const navigate = useNavigate();
  const {
    getAccessTokenSilently,
    isLoading: authLoading,
  } = useAuth0();

  const [estimations, setEstimations] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();
        const estimationData = await getEstimations(token);
        const userPurchases = await getUserPurchases(token);

        setEstimations(estimationData.result);
        const sortedPurchases = (userPurchases || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setPurchases(sortedPurchases);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [getAccessTokenSilently]);

  if (authLoading || loading) {
    return <div style={{ padding: "2rem" }}>Cargando datos...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "2rem" }}>
        Estimaciones de Ganancias
      </h1>

      {estimations ? (
        <div
          style={{
            backgroundColor: "var(--border)",
            padding: "1.5rem",
            borderRadius: "10px",
            marginBottom: "2rem",
          }}
        >
          <h2>Ganancia estimada total:</h2>
          <p style={{ fontSize: "2rem", margin: 0 }}>
            ${estimations.estimated_gains.toLocaleString()}
          </p>

          <h3 style={{ marginTop: "1rem" }}>Detalle por acción:</h3>
          {estimations.details.map((detail, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "var(--background)",
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "0.5rem",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>{detail.symbol}</strong>: {detail.quantity} acciones
              </p>
              <p style={{ margin: 0 }}>
                Actual: ${detail.current} / Proyectado: ${detail.projected}
              </p>
              <p style={{ margin: 0 }}>
                Valor estimado: ${detail.estimated_value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron estimaciones.</p>
      )}

      <h2>Mis Compras</h2>

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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/stocks/${purchase.symbol}`)}
            >
              <div>
                <p style={{ margin: 0 }}>
                  <strong>{purchase.symbol}</strong> — {purchase.quantity}{" "}
                  acciones
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {new Date(purchase.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    color:
                      purchase.status === "ACCEPTED"
                        ? "var(--green)"
                        : "var(--red)",
                  }}
                >
                  {purchase.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wallet;
