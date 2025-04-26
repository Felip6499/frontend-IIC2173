import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import StockPage from "../../pages/StockPage";
import WalletPage from "../../pages/WalletPage";
import StockDetailPage from "../../pages/StockDetailPage";
import Navbar from "../layout/Navbar";

function Routing() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stocks" element={<StockPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/stocks/:symbol" element={<StockDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
