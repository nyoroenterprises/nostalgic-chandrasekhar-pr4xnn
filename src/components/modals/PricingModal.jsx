export default function ContactModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-700 text-sm mb-4">
          For questions, please email us at support@example.com
        </p>
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          placeholder="Your Message"
          className="w-full border p-2 rounded mb-3"
        ></textarea>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Send Message
        </button>
      </div>
    </div>
  );
}
