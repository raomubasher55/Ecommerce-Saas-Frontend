import React, { useEffect, useState } from "react";

export default function CustomerSupport() {
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token"); // ✅ Get token from localStorage

  // ✅ Fetch messages with token
  useEffect(() => {
    fetch(`${import.meta.env.VITE_APP}/api/v1/contact`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Send token
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  // ✅ Mark message as read with token
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/contact/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
      });

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, status: "read" } : msg
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Messages</h2>
      <div className="w-[250px] sm:w-full overflow-scroll">

        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Message</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages?.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg._id} className="text-center">
                  <td className="py-2 px-4 border">{msg.name}</td>
                  <td className="py-2 px-4 border">
                    <a
                      href={`mailto:${msg.email}?subject=Regarding Your Message&body=Hello ${msg.name},`}
                      className="text-blue-600 hover:underline"
                    >
                      {msg.email}
                    </a>
                  </td>

                  <td className="py-2 px-4 border">{msg.message}</td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${msg.status === "read" ? "bg-green-500" : "bg-red-500"
                        }`}
                    >
                      {msg.status || "unread"}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {msg.status !== "read" ? (
                      <button
                        onClick={() => markAsRead(msg._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <span className="text-gray-500">✔ Read</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No messages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
