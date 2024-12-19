// components/OrderSummary.tsx
import { useEffect, useState } from "react";
import { retrieveOrder } from "../api/order";

interface OrderSummaryProps {
  orderId: string;
}

const OrderSummary = ({ orderId }: OrderSummaryProps) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const order = await retrieveOrder(orderId);
        setOrderDetails(order);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (!orderDetails) return <p>Loading order details...</p>;

  return (
    <div>
      <h3>Your Order Summary</h3>
      <ul>
        {orderDetails.order.map((item: any) => (
          <li key={item.id}>
            {item.itemName} - {item.optionValues.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderSummary;
