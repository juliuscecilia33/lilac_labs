import { useState } from "react";

interface OrderFormProps {
  onOrderSubmit: (order: string) => void;
}

const OrderForm = ({ onOrderSubmit }: OrderFormProps) => {
  const [orderInput, setOrderInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderSubmit(orderInput);
    setOrderInput("");
  };

  return (
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
  );
};

export default OrderForm;
