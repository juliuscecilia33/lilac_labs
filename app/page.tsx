"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";

const Home = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const handleStartOrder = async () => {
    const response = await axios.post(
      "/api/lilac-agent/start",
      { location: "ben-franks" } // Send location in the body
    );

    console.log("Order started, ID: ", response.data.orderId);
    setOrderId(response.data.orderId);
  };

  const handleChatSubmit = async (input: string) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);

      const response = await axios.post("/api/lilac-agent/chat", {
        orderId: orderId,
        input: input,
        location: "ben-franks",
      });

      console.log(
        "Order message sent, response: ",
        response.data.chatResponse.messages
      );

      const assistantMessages = response.data.chatResponse.messages || [];

      // Append the assistant's response(s) to the chat
      setMessages(() => [
        ...assistantMessages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]);
      // Handle the response, for example, store the orderId or display success message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [orderInput, setOrderInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChatSubmit(orderInput);
    setOrderInput("");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold my-10 text-center">
        Welcome to Ben Frank's!
      </h1>
      {orderId ? (
        <div>
          {/* Chat messages */}
          <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
                  {msg.content}
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg"
          >
            <label htmlFor="order" className="block text-xl font-semibold mb-2">
              Your Order:
            </label>
            <input
              id="order"
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Enter your order..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit Order
            </button>
          </form>
          {/* <OrderSummary orderId={orderId} /> */}
        </div>
      ) : (
        <button
          onClick={handleStartOrder}
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Start Order
        </button>
      )}
    </div>
  );
};

export default Home;
