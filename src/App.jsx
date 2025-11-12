import { HashRouter, Routes, Route } from "react-router-dom";
import AppContextProvider from "./components/Configurator/contexts/appContext";
import HomePage from "./HomePage";
import Checkout from "./pages/Checkout"; // 👈 you’ll create this page soon

export default function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AppContextProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </HashRouter>
      </AppContextProvider>
    </div>
  );
}
