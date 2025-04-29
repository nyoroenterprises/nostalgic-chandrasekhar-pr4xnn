// src/components/Footer.jsx

export default function Footer({ setModal }) {
  return (
    <footer className="mt-12 text-center text-sm text-gray-500 space-x-6">
      <button
        onClick={() => setModal("privacy")}
        className="underline text-blue-600 hover:text-blue-800 transition"
      >
        Privacy Policy
      </button>

      <button
        onClick={() => setModal("terms")}
        className="underline text-blue-600 hover:text-blue-800 transition"
      >
        Terms & Conditions
      </button>

      <button
        onClick={() => setModal("contact")}
        className="underline text-blue-600 hover:text-blue-800 transition"
      >
        Contact Us
      </button>

      <button
        onClick={() => setModal("pricing")}
        className="underline text-blue-600 hover:text-blue-800 transition"
      >
        Pricing
      </button>
    </footer>
  );
}
