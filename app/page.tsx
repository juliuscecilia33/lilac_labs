"use client";

import { useState } from "react";
import axios from "axios";
import { parseTotalPrice } from "./utils/helpers";
import ChatWindow from "./components/ChatWindow";
import OrderForm from "./components/OrderForm";
import Spinner from "./components/Spinner";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Starts the order by making an API request
  const handleStartOrder = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/lilac-agent/start", {
        location: "ben-franks",
      });

      console.log(
        "Order started! Here's the Order ID: ",
        response.data.orderId
      );
      setOrderId(response.data.orderId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error starting order:", error);
    }
  };

  // Handles user chat submission and updates the order and chat state
  const handleChatSubmit = async (input: string) => {
    setIsLoading(true);
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

      const newTotalPrice = parseTotalPrice(assistantMessages);
      if (newTotalPrice !== null) setTotalPrice(newTotalPrice);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex-1">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Welcome to Ben Frank&apos;s!
        </h1>

        {/* If the order has started, show chat interface */}
        {orderId ? (
          <>
            {/* Chat messages */}
            <ChatWindow messages={messages} />

            {/* Order input form */}
            <OrderForm
              orderInput={orderInput}
              setOrderInput={setOrderInput}
              isLoading={isLoading}
              handleSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit(orderInput);
                setOrderInput("");
              }}
            />
          </>
        ) : (
          // Button to start the order if not already started
          <button
            onClick={handleStartOrder}
            disabled={isLoading}
            className={`w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isLoading ? "cursor-not-allowed opacity-75" : ""
            }`}
          >
            {isLoading && <Spinner />}
            {isLoading ? "Processing..." : "Start Order"}
          </button>
        )}
      </div>

      {/* Order Summary */}
      <div className="flex-1 max-w-md p-4 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        {/* Display order details if order exists */}
        {order.length > 0 ? (
          <>
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

            {/* Display total price if there are items in the order */}
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
          </>
        ) : (
          <p>No items in the order yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
