import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ecsxlejygxvgpjxkcrja.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc3hsZWp5Z3h2Z3BqeGtjcmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDY4NjIsImV4cCI6MjA2MTE4Mjg2Mn0.67Z9aO1aXX3eXQYnZuSNni5bHy0YhCY6JFzu2tES2gY"
);
export default function CarrierForm({ setPage }) {
  const [modal, setModal] = useState(null);
  const [carrier, setCarrier] = useState({
    name: "",
    mc: "",
    dot: "",
    ein: "",
    contact: "",
    email: "",
  });
  const [broker, setBroker] = useState({ name: "", email: "" });
  const [documents, setDocuments] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [includeBank, setIncludeBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    routing: "",
    account: "",
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCarrierChange = (e) => {
    const { name, value } = e.target;
    if (["mc", "dot", "ein"].includes(name)) {
      if (!/^\d{0,10}$/.test(value)) return;
    } else {
      if (value.length > 30) return;
    }
    setCarrier((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrokerChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > 30) return;
    setBroker((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const filesArray = Array.from(e.target.files);
    const totalSize = filesArray.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 30 * 1024 * 1024;
    if (filesArray.length > 10) {
      alert("You can only attach up to 10 documents.");
      return;
    }
    if (totalSize > maxSize) {
      alert("Total file size cannot exceed 30MB.");
      return;
    }
    const files = filesArray.map((file) => ({ file, label: "" }));
    setDocuments(files);
  };

  const handleLabelChange = (index, value) => {
    setDocuments((prev) => {
      const updated = [...prev];
      updated[index].label = value;
      return updated;
    });
  };

  const uploadDocument = async (userId, doc) => {
    const filePath = `${userId}/${Date.now()}-${doc.file.name}`;
    const { data, error } = await supabase.storage
      .from("carrier-docs")
      .upload(filePath, doc.file);
    if (error) throw error;
    const { data: publicData } = supabase.storage
      .from("carrier-docs")
      .getPublicUrl(filePath);
    if (!publicData || !publicData.publicUrl) {
      throw new Error("Failed to retrieve public URL after upload.");
    }
    return { url: publicData.publicUrl, label: doc.label };
  };

  const handleSubmit = async () => {
    if (
      carrier.email &&
      broker.email &&
      carrier.email.toLowerCase() === broker.email.toLowerCase()
    ) {
      alert("Contact Email and Broker Email cannot be the same.");
      return;
    }
    if (
      !carrier.name ||
      carrier.name.length > 30 ||
      !carrier.mc ||
      !/^\d{1,10}$/.test(carrier.mc) ||
      !carrier.dot ||
      !/^\d{1,10}$/.test(carrier.dot) ||
      !carrier.ein ||
      !/^\d{1,10}$/.test(carrier.ein) ||
      !carrier.contact ||
      carrier.contact.length > 30 ||
      !carrier.email ||
      !validateEmail(carrier.email) ||
      !broker.name ||
      broker.name.length > 30 ||
      !broker.email ||
      !validateEmail(broker.email) ||
      (includeBank &&
        (!bankDetails.bankName || !bankDetails.routing || !bankDetails.account))
    ) {
      alert("Please complete all fields correctly before submitting.");
      return;
    }

    if (!agreed || documents.some((doc) => !doc.label)) {
      alert("Please fill in all labels and agree to terms.");
      return;
    }

    setLoading(true);

    try {
      const email = carrier.email;
      const presetPassword = "instant-packet-123";
      let user = null;

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password: presetPassword,
        });
      user = loginData?.user;

      if (loginError || !user) {
        const { data: signupData, error: signupError } =
          await supabase.auth.signUp({ email, password: presetPassword });
        if (signupError) {
          throw signupError;
        }
        user = signupData?.user;
      }

      if (!user) {
        throw new Error("Unable to authenticate user.");
      }

      const uploadedDocs = await Promise.all(
        documents.map((doc) => uploadDocument(user.id, doc))
      );

      const packetData = {
        carrier_name: carrier.name,
        mc_number: carrier.mc,
        dot_number: carrier.dot,
        ein: carrier.ein,
        contact_name: carrier.contact,
        contact_email: carrier.email,
        broker_name: broker.name,
        broker_email: broker.email,
        notes: "",
        attachments: JSON.stringify(uploadedDocs),
        user_id: user.id,
      };

      const { error: insertError } = await supabase
        .from("carrier_packets")
        .insert([packetData]);
      if (insertError) {
        throw insertError;
      }

      alert("Carrier Packet submitted successfully!");
      setPage("dashboard");
      return; // ✅ ADD THIS to prevent falling into catch block after success
    } catch (err) {
      console.error("Submission error:", err);
      alert("There was an error submitting your packet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Instant Carrier Packet
      </h1>

      {/* Carrier and Broker Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Carrier Name"
          name="name"
          value={carrier.name}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="MC #"
          name="mc"
          value={carrier.mc}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="DOT #"
          name="dot"
          value={carrier.dot}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="EIN"
          name="ein"
          value={carrier.ein}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact Name"
          name="contact"
          value={carrier.contact}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact Email"
          name="email"
          value={carrier.email}
          onChange={handleCarrierChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Broker Name"
          name="name"
          value={broker.name}
          onChange={handleBrokerChange}
        />
        <input
          className="border p-2 rounded"
          placeholder="Broker Email"
          name="email"
          value={broker.email}
          onChange={handleBrokerChange}
        />
      </div>

      {/* Attach Documents */}
      <div className="pt-4">
        <label className="block font-medium">Attach Documents</label>
        <input
          type="file"
          multiple
          className="border p-2 rounded w-full"
          onChange={handleFilesChange}
        />
      </div>

      {documents.length > 0 && (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {documents.map((doc, index) => (
            <li
              key={index}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span className="text-sm font-medium">{doc.file.name}</span>
              <select
                className="text-xs border rounded p-1 ml-2"
                value={doc.label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
              >
                <option value="">Select Label</option>
                <option value="W-9">W-9</option>
                <option value="COI">COI</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex items-center space-x-2">
                <a
                  href={URL.createObjectURL(doc.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs underline"
                >
                  View
                </a>
                <button
                  onClick={() =>
                    setDocuments((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-600 text-xs underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Bank Section */}
      <div className="pt-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            className="border rounded"
            checked={includeBank}
            onChange={(e) => setIncludeBank(e.target.checked)}
          />
          <span className="text-sm">Include Bank Details To Broker</span>
        </label>
      </div>

      {includeBank && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-gray-100 border rounded-xl">
          <input
            className="border p-2 rounded"
            placeholder="Bank Name"
            name="bankName"
            value={bankDetails.bankName}
            onChange={(e) =>
              setBankDetails((prev) => ({ ...prev, bankName: e.target.value }))
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Routing #"
            name="routing"
            value={bankDetails.routing}
            maxLength={10}
            onChange={(e) => {
              if (/^\d{0,10}$/.test(e.target.value)) {
                setBankDetails((prev) => ({
                  ...prev,
                  routing: e.target.value,
                }));
              }
            }}
          />
          <input
            className="border p-2 rounded"
            placeholder="Account #"
            name="account"
            value={bankDetails.account}
            maxLength={10}
            onChange={(e) => {
              if (/^\d{0,10}$/.test(e.target.value)) {
                setBankDetails((prev) => ({
                  ...prev,
                  account: e.target.value,
                }));
              }
            }}
          />
        </div>
      )}

      {/* Agreement Checkbox and Submit Button */}
      <div className="pt-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            className="border rounded"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm">
            I agree to the Terms and Privacy Policy
          </span>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Carrier Packet"}
      </button>
    </div>
  );
}
