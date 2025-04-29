// Rollback to reset point: includes modal popup for New Carrier Packet, tabbed User Profile modal (Profile, Attachments, Membership), and footer modals

import { useState } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Carrier User");
  const [mcNumber, setMcNumber] = useState("MC123456");
  const [dotNumber, setDotNumber] = useState("DOT7891011");
  const [ein, setEin] = useState("12-3456789");
  const [carrierEmail, setCarrierEmail] = useState("carrier@example.com");
  const [bankName, setBankName] = useState("Example Bank");
  const [includeBankDetails, setIncludeBankDetails] = useState(
    !!bankName || !!routingNumber || !!accountNumber
  );
  const [routingNumber, setRoutingNumber] = useState("123456789");
  const [accountNumber, setAccountNumber] = useState("****5678");
  const [documents, setDocuments] = useState([{ name: "W-9.pdf", url: "#" }]);
  const [modal, setModal] = useState(null);
  const [brokerName, setBrokerName] = useState("");
  const [brokerEmail, setBrokerEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const packetHistory = [
    {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: "2025-04-01",
      broker: "ABC Logistics",
      email: "abc@example.com",
      status: "Sent",
    },
    {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: "2025-04-02",
      broker: "XYZ Freight",
      email: "xyz@example.com",
      status: "Viewed",
    },
    {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: "2025-04-03",
      broker: "Fast Haul",
      email: "fast@example.com",
      status: "Pending",
    },
    {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: "2025-04-04",
      broker: "Heavy Haul",
      email: "haul@example.com",
      status: "Sent",
    },
    {
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: "2025-04-05",
      broker: "Quick Trucks",
      email: "quick@example.com",
      status: "Viewed",
    },
  ];

  const totalPages = Math.ceil(packetHistory.length / pageSize);
  const paginatedHistory = packetHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setModal("profile-info")}
            className="text-gray-700 hover:underline"
          >
            Welcome, {userName}
          </button>
          <button className="text-sm text-blue-600 underline">Sign Out</button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">History</h2>
          <button
            onClick={() => setModal("new-packet")}
            className="text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            + New Carrier Packet
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th>Date</th>
                <th className="px-4 py-2 text-left">Broker</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">View</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((packet, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{packet.id}</td>
                  <td className="px-4 py-2">{packet.date}</td>
                  <td className="px-4 py-2">{packet.broker}</td>
                  <td className="px-4 py-2">{packet.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setModal("view-packet")}
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2">{packet.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="text-sm text-blue-600 underline disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="text-sm text-blue-600 underline disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
