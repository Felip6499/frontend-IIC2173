import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import StockPage from "../../pages/StockPage";
import WalletPage from "../../pages/WalletPage";
import StockDetailPage from "../../pages/StockDetailPage";
import Navbar from "../layout/Navbar";
import PaymentConfirmationPage from "../../pages/PaymentConfirmationPage";
import AdminRoute from "./AdminRoute";
import MyStocksPage from "../../pages/MyStocksPage";
import AuctionsPage from "../../pages/AuctionsPage";
import ProposalsPage from "../../pages/ProposalsPage";

function Routing() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stocks" element={<StockPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/stocks/:symbol" element={<StockDetailPage />} />
        <Route path="/payment/confirm" element={<PaymentConfirmationPage />} />

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="my-stocks" element={<MyStocksPage />} />
          <Route path="auctions" element={<AuctionsPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
