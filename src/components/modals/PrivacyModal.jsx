export default function PrivacyModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
        <p className="text-gray-700 text-sm">
          We value your privacy and protect your information. (Add full policy
          text here.)
        </p>
      </div>
    </div>
  );
}
