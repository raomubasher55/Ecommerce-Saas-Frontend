import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const packageData = {
  // Default data remains unchanged
};

export default function Subscription() {
  const [plans, setPlans] = useState([]); // Start with an empty array, not default data
  const [featuresList, setFeaturesList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to check if data is being fetched

  // Fetch subscription plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/v1/subscription`);
        const fetchedPlans = response.data;
        setPlans(fetchedPlans);

        if (fetchedPlans.length > 0) {
          // Dynamically set feature list from the fetched data
          setFeaturesList(Object.keys(fetchedPlans[0].features));
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error.response?.data || error.message);
        toast.error("Failed to load subscription plans.");
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchPlans();
  }, []);

  const handleFeatureChange = (planIndex, featureName, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureName] = value;
    setPlans(updatedPlans);
  };

  const handlePriceChange = (planIndex, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].price = Number(value);
    setPlans(updatedPlans);
  };

  const handleSave = async () => {
    try {
      const payload = plans.map(plan => ({
        ...plan,
        price: Number(plan.price),
        features: { ...plan.features },
      }));

      await axios.put(`${import.meta.env.VITE_APP_API_URL}/api/v1/subscription`, payload);

      toast.success("Plans saved successfully!");
      // Optionally, re-fetch the data or update the UI after saving
    } catch (error) {
      console.error("Failed to save plans:", error.response?.data || error.message);
      toast.error("Failed to save plans!");
    }
  };

  // const deleteFeature = (feature) => {
  //   const updatedFeatures = featuresList.filter(f => f !== feature);
  //   setFeaturesList(updatedFeatures);
  //   const updatedPlans = plans.map(plan => {
  //     const updated = { ...plan };
  //     delete updated.features[feature];
  //     return updated;
  //   });
  //   setPlans(updatedPlans);
  // };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="p-6 w-[260px] sm:w-full mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Plan Management</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleSave} className="bg-green-500 w-full sm:w-auto text-white px-4 py-2 rounded">
            Save Plans
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2">Features</th>
              {plans.map((plan, idx) => (
                <th key={idx} className="border p-2">
                  <div className="flex flex-col items-center">
                    <div className="font-semibold">{plan.name}</div>
                    <input
                      className="border border-blue-200 p-1 text-center w-24 mt-1"
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(idx, e.target.value)}
                    />
                    <div className="text-xs text-gray-500">DZD</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featuresList.map((feature, featureIdx) => (
              <tr key={featureIdx} className={featureIdx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                <td className="border border-blue-200 p-1 flex justify-between items-center">
                  <span>{feature}</span>
                  {/* <button onClick={() => deleteFeature(feature)} className="text-red-500 ml-2">
                    <FaTrash />
                  </button> */}
                </td>
                {plans.map((plan, planIdx) => (
                  <td key={planIdx} className="border p-2">
                    {typeof plan.features[feature] === "boolean" ? (
                      <select
                        className="border border-blue-200 p-1 text-center w-full"
                        value={plan.features[feature] ? "true" : "false"}
                        onChange={(e) => handleFeatureChange(planIdx, feature, e.target.value === "true")}
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        className="border border-blue-200 p-1 text-center w-full"
                        value={plan.features[feature] ?? ""}
                        onChange={(e) => handleFeatureChange(planIdx, feature, e.target.value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
