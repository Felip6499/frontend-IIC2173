import axios from "axios";

export async function initiatePayment(symbol, quantity, token) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/webpay/pay`,
    { symbol, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function confirmPayment(token_ws, token) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/webpay/confirm`,
    { token_ws },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getEstimations(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/estimations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getHeartbeat(token) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/estimations/heartbeat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching heartbeat:", error);
    return { alive: false };
  }
}

export async function getTopStocks(token, email) {
  try {
    console.log("Fetching top stocks for email:", email);
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/stocks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error cargando stocks:", error);
    return [];
  }
}

export async function getAllStocks(page = 1, count = 6, token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/stocks?page=${page}&count=${count}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
export async function getStockBySymbol(symbol, token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/stocks/${symbol}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data[0];
}
export async function buyStock(symbol, quantity, token) {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/requests/buy-stock`,
    { symbol, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export async function getUserProfile(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getUserPurchases(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/user/requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function updateUserMoney(money, token) {
  const response = await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/user/update-money`,
    { money },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function postUserEmail(email, token) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/user`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error en postUserEmail:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtener todas las ofertas (subastas)
export async function getOffers(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/offers`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.offers;
}

// Crear una nueva oferta (subastar)
export async function createOffer(symbol, quantity, token) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/offers`,
    { symbol, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

// Crear una propuesta de intercambio para una oferta
export async function createProposal(auction_id, symbol, quantity, token) {
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/proposals`,
    { auction_id, symbol, quantity },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

// Responder a una propuesta (aceptar/rechazar)
export async function respondToProposal(proposal_id, response, token) {
  const result = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/proposals/${proposal_id}/respond`,
    { response }, // response puede ser 'accept' o 'reject'
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return result.data;
}

// 
export async function getAdminStocks(token) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/stocks`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.stocks || response.data;
}
