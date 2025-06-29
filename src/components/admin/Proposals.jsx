import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getOffers, respondToProposal } from "../../utils/api";

function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const offersData = await getOffers(token);
      const myOffers = offersData;
      const allProposals = myOffers.flatMap((offer) =>
        offer.proposals.map((p) => ({ ...p, offerSymbol: offer.symbol }))
      );
      setProposals(allProposals.filter((p) => p.state === "pending"));
    } catch (err) {
      console.error("Error al obtener propuestas:", err);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleResponse = async (proposal_id, response) => {
    try {
      const token = await getAccessTokenSilently();
      await respondToProposal(proposal_id, response, token);
      alert(`Propuesta ${response === "accept" ? "aceptada" : "rechazada"}.`);
      fetchProposals();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div
        style={{ textAlign: "center", marginTop: "5rem", fontSize: "1.5rem" }}
      >
        Cargando propuestas recibidas...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "var(--accent-yellow)", marginBottom: "1rem" }}>
        Propuestas Recibidas
      </h1>

      {proposals.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No hay propuestas pendientes.
        </p>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {proposals.map((p) => (
            <div
              key={p.proposal_id}
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
              <div style={{ marginBottom: "0.5rem" }}>
                <h2 style={{ margin: 0 }}>Oferta de {p.offerSymbol}</h2>
                <p style={{ margin: "0.5rem 0" }}>
                  Grupo {p.group_id} ofrece {p.quantity} de{" "}
                  <strong>{p.symbol}</strong>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleResponse(p.proposal_id, "accept")}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "var(--accent-yellow)",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Aceptar
                </button>
                <button
                  onClick={() => handleResponse(p.proposal_id, "reject")}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid var(--accent-yellow)",
                    backgroundColor: "transparent",
                    color: "var(--accent-yellow)",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Proposals;
