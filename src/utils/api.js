import axios from "axios";

export async function getTopStocks() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/stocks`
    );
    return response.data;
  } catch (error) {
    console.error("Error cargando stocks:", error);
    return [];
  }
}

export async function getAllStocks(page = 1, count = 6) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/stocks?page=${page}&count=${count}`
  );
  return response.data;
}
export async function getStockBySymbol(symbol) {
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/stocks/${symbol}`
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
