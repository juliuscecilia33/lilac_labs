import { NextResponse } from "next/server";
import axios from "axios";

/**
 * Handles POST requests to retrieve the current order details and state.
 *
 * This function expects an `orderId` in the incoming request body. If the `orderId`
 * is provided, the function sends a GET request to an external API to fetch the order
 * details.
 *
 * If the request is successful, it returns the order data to the client. If any error
 * occurs (e.g., missing `orderId` or API failure), an appropriate error message is returned.
 *
 * @param request - The incoming HTTP request object containing the `orderId` parameter.
 * @returns A JSON response with either the order data or an error message.
 */
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json(); // Parse JSON body

    console.log("order id for order: ");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId parameter is required." },
        { status: 400 }
      );
    }

    const response = await axios.get(
      "https://test.lilaclabs.ai/lilac-agent/order",
      {
        data: { orderId: orderId }, // Pass orderId as a query parameter
        headers: {
          "x-api-key": `Bearer ${process.env.API_TOKEN}`, // Include your API token
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error calling external API:", error);
    return NextResponse.json(
      { error: "Error starting order" },
      { status: 500 }
    );
  }
}
