"use client";

import { useState } from "react";
import axios from "axios";
import parse from "words-to-numbers";

const Home = () => {
  // State to hold the order ID, messages, and the order details
  const [orderId, setOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        content: "Welcome to Ben Frank's! How may I help you today?",
        role: "assistant",
      },
    ]
  );
  const [order, setOrder] = useState<
    {
      itemName: string;
      price: number;
      optionKeys: string[];
      optionValues: string[][];
    }[]
  >([]);
  const [orderInput, setOrderInput] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  // Starts the order by making an API request
  const handleStartOrder = async () => {
    try {
      const response = await axios.post("/api/lilac-agent/start", {
        location: "ben-franks",
      });

      console.log(
        "Order started! Here's the Order ID: ",
        response.data.orderId
      );
      setOrderId(response.data.orderId);
    } catch (error) {
      console.error("Error starting order:", error);
    }
  };

  // Handles user chat submission and updates the order and chat state
  const handleChatSubmit = async (input: string) => {
    try {
      // Add user message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
      ]);

      // Send message to the server and get chat response
      const response = await axios.post("/api/lilac-agent/chat", {
        orderId: orderId,
        input: input,
        location: "ben-franks",
      });

      // Get the updated order state
      const orderState = await axios.post("/api/lilac-agent/order", {
        orderId: orderId,
      });

      setOrder(orderState.data.order);
      console.log("Current Order State:", orderState);

      // Update chat with assistant's response
      const assistantMessages = response.data.chatResponse.messages || [];
      setMessages(() => [
        ...assistantMessages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]);

      const totalPriceMessage = assistantMessages.find(
        (msg: { role: string; content: string }) =>
          msg.content.toLowerCase().includes("total is")
      );

      if (totalPriceMessage) {
        const priceMatch = totalPriceMessage.content.match(
          /total is ([\w\s-]+) dollars?/i
        );

        if (priceMatch) {
          const wordPrice = priceMatch[1]; // Extracts the part like "fourteen"
          const convertedPrice = parse(wordPrice); // Convert words to numbers

          // Improved regex for cents in words
          const centsMatch = totalPriceMessage.content.match(
            /and ([\w\s-]+) cents?/i
          );

          if (centsMatch) {
            const wordCents = centsMatch[1];
            const convertedCents = parse(wordCents);
            setTotalPrice(parseFloat(`${convertedPrice}.${convertedCents}`));
          } else {
            setTotalPrice(parseFloat(`${convertedPrice}`)); // No cents in the message
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle form submission and pass order input to chat
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChatSubmit(orderInput);
    setOrderInput("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Welcome to Ben Frank's!
        </h1>

        {/* If the order has started, show chat interface */}
        {orderId ? (
          <div>
            {/* Chat messages */}
            <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg mb-4">
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
                    <strong>
                      {msg.role === "user" ? "You" : "Assistant"}:
                    </strong>{" "}
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Order input form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg"
            >
              <label
                htmlFor="order"
                className="block text-xl font-semibold mb-2"
              >
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
          </div>
        ) : (
          // Button to start the order if not already started
          <button
            onClick={handleStartOrder}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Start Order
          </button>
        )}
      </div>

      {/* Order Summary */}
      <div className="flex-1 max-w-md p-4 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        {/* Display order details if order exists */}
        {order.length > 0 ? (
          <ul className="space-y-4">
            {order.map((item, index) => (
              <li key={index} className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-semibold">{item.itemName}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Price:</strong> ${item.price.toFixed(2)}
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {item.optionKeys.map((key, idx) => (
                    <li className="capitalize" key={idx}>
                      <strong>{key}:</strong>{" "}
                      {item.optionValues[idx]?.join(", ") || "None"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the order yet.</p>
        )}

        {/* Display total price if there are items in the order */}
        {order.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">
              Total Price: $
              {totalPrice !== null
                ? totalPrice.toFixed(2)
                : order
                    .reduce((total, item) => total + (item.price || 0), 0)
                    .toFixed(2)}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
