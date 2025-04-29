import "./styles.css";
import { useState } from "react";
import CarrierForm from "./components/CarrierForm";
import Dashboard from "./components/Dashboard"; // if you have a Dashboard
import Footer from "./components/Footer";
import LoginModal from "./components/modals/LoginModal";
import PrivacyModal from "./components/modals/PrivacyModal";
import TermsModal from "./components/modals/TermsModal";
import ContactModal from "./components/modals/ContactModal";
import PricingModal from "./components/modals/PricingModal";

export default function App() {
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState("form"); // or 'dashboard'

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="flex-grow">
        {page === "form" && <CarrierForm setPage={setPage} />}
        {page === "dashboard" && <Dashboard />}
      </div>

      <Footer setModal={setModal} />

      {/* Modals */}
      {modal === "login" && <LoginModal onClose={() => setModal(null)} />}
      {modal === "privacy" && <PrivacyModal onClose={() => setModal(null)} />}
      {modal === "terms" && <TermsModal onClose={() => setModal(null)} />}
      {modal === "contact" && <ContactModal onClose={() => setModal(null)} />}
      {modal === "pricing" && <PricingModal onClose={() => setModal(null)} />}
    </div>
  );
}
