import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getTopStocks, getHeartbeat, postUserEmail } from "../../utils/api";
import StockPreview from "./StockPreview";
import img1 from "../../assets/images/Imagen1.jpg";
import img2 from "../../assets/images/Imagen2.jpg";
import img3 from "../../assets/images/Imagen3.jpg";

function Home() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [stocks, setStocks] = useState([]);
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {

    async function registerUser() {
      try {
        const token = await getAccessTokenSilently();
        if (user?.email) {
          await postUserEmail(user.email, token);
          console.log("Usuario registrado en backend:", user.email);
        }
      } catch (error) {
        console.error("Error registrando usuario:", error);
      }
    }

    async function fetchData() {
      const token = await getAccessTokenSilently();
      console.log("Fetching top stocks for user:", user.name);
      console.log("user:", user);
      console.log("user.email:", user.email);
      const data = await getTopStocks(token, user.name);
      setStocks(data.slice(0, 5));
    }

    async function fetchHeartbeat() {
      const token = await getAccessTokenSilently();
      const data = await getHeartbeat(token);
      setHeartbeat(data.alive);
    }

    registerUser();
    fetchData();
    fetchHeartbeat();
    const interval = setInterval(fetchHeartbeat, 60000);
    return () => clearInterval(interval);
  }, [getAccessTokenSilently, user]);

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "2rem" }}
      >
        <div
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: heartbeat ? "green" : "red",
            marginRight: "0.5rem",
          }}
        ></div>
        <h3 style={{ margin: 0, color: "var(--text-light)" }}>Workers</h3>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4rem",
        }}
      >
        <div style={{ flex: "1", minWidth: "300px", padding: "4rem" }}>
          <h1
            style={{
              color: "var(--accent-yellow)",
              fontSize: "4rem",
              margin: 0,
            }}
          >
            Comerciar
          </h1>
          <h2
            style={{
              color: "var(--text-light)",
              fontSize: "2rem",
              marginTop: "1rem",
            }}
          >
            nunca ha sido más fácil
          </h2>
          <p
            style={{
              marginTop: "2rem",
              fontSize: "1.1rem",
              color: "var(--text-muted)",
            }}
          >
            Con Stockify, accede al mercado accionario en tiempo real, invierte
            de manera inteligente y gestiona tu portafolio en segundos.
          </p>
        </div>

        <div style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ color: "var(--accent-yellow)", marginBottom: "1.5rem" }}>
            Acciones Populares
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {stocks.map((stock) => (
              <StockPreview key={stock.symbol} stock={stock} />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          marginBottom: "4rem",
        }}
      >
        <h2 style={{ color: "var(--accent-yellow)" }}>
          Invierte con Confianza
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-muted)",
            marginTop: "1rem",
          }}
        >
          Nuestra plataforma te conecta a los mercados globales de manera segura
          y rápida. No importa si eres principiante o experto, aquí encontrarás
          todo lo que necesitas para llevar tu estrategia de inversión al
          siguiente nivel. ¡Explora, aprende y haz crecer tu patrimonio con
          nosotros!
        </p>
      </div>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          borderRadius: "12px",
          backgroundColor: "var(--border)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            animation: "scroll 20s linear infinite",
            gap: "2rem",
          }}
        >
          <img
            src={img1}
            alt="Imagen 1"
            style={{
              width: "1000px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />

          <img
            src={img2}
            alt="Imagen 2"
            style={{
              width: "1000px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />

          <img
            src={img3}
            alt="Imagen 3"
            style={{
              width: "1000px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-30%); }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
