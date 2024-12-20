import { NextResponse } from "next/server";
import axios from "axios";

/**
 * Handles POST requests to send order-related information to an external API.
 *
 * This function extracts the `orderId`, `input`, and `location` from the incoming
 * request body, validates that all required parameters are provided, and sends
 * the data to generate the next response and update the order
 *
 * @param request - The incoming HTTP request object containing the order details.
 * @returns A JSON response with either the chat response from the external API or
 *          an error message if the request fails.
 */
export async function POST(request: Request) {
  const { orderId, input, location } = await request.json();

  // Check if the necessary parameters are provided
  if (!orderId || !input || !location) {
    return NextResponse.json(
      { error: "orderId, input, and location are required." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://test.lilaclabs.ai/lilac-agent/chat", // External API endpoint
      {
        orderId,
        input,
        location, // Pass the data in the body to the external API
      },
      {
        headers: {
          "x-api-key": `Bearer ${process.env.API_TOKEN}`, // Use your API token from environment variables
        },
      }
    );

    return NextResponse.json({ chatResponse: response.data });
  } catch (error) {
    console.error("Error calling external API:", error);
    return NextResponse.json(
      { error: "Error sending order message" },
      { status: 500 }
    );
  }
}
