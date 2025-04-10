import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

export default function PaymentRecord() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/store/Allstore-cards", {
        withCredentials: true,
      })
      .then((res) => {
        setCards(res.data.cards);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        All Store Payment Cards
      </h1>

      {/* Store List */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-3"
          >
            <div>
              <h3 className="text-lg font-bold">{card.store.name}</h3>
              <p className="text-sm text-gray-600">{card.store.email}</p>
              <p className="text-sm text-gray-600">{card.store.phone}</p>
            </div>
            <button
              onClick={() => setSelectedCard(card)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Check Bank Card Detail
            </button>
          </div>
        ))}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold">{selectedCard.holderName}</h3>
            <p className="text-lg tracking-widest mt-1">
              {selectedCard.cardNumber}
            </p>
            <div className="flex justify-between mt-2">
              <span>Expiry: {selectedCard.expiryDate}</span>
              <span>CVC: {selectedCard.cvc}</span>
            </div>

            <div className="absolute top-4 right-4 text-3xl">
              {selectedCard.cardType === "Visa" && (
                <FaCcVisa className="text-blue-600" />
              )}
              {selectedCard.cardType === "MasterCard" && (
                <FaCcMastercard className="text-red-600" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
