import { useEffect, useState } from "react";
import axios from "axios";

const Info = () => {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch user information on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/info`);
        if (response.data) {
          const { email, address, phone } = response.data.info; // Updated to use address
          setEmail(email);
          setAddress(address); // Update state for address
          setPhone(phone);
        }
      } catch (err) {
        setError("Failed to fetch information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(`${import.meta.env.VITE_APP}/api/v1/info`, {
        email,
        address,
        phone,
      });
      if (response.data.success) {
        setSuccess("Information updated successfully!");
      }
    } catch (err) {
      setError("Failed to update information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white p-2 rounded ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Info"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default Info;
