import { NextResponse } from "next/server";
import axios from "axios";

/**
 * Handles POST requests to start a new order
 *
 * Function expects a `location` parameter in the request body. If the `location`
 * is provided, the function sends POST request to start an order,
 * passing the location in the request body.
 *
 * If the request is successful, the order ID is returned
 * to the client. If any error occurs (e.g., missing `location` or API failure), an
 * appropriate error message is returned.
 *
 * @param request - The incoming HTTP request object containing the `location` parameter.
 * @returns A JSON response with either the order ID or an error message.
 */
export async function POST(request: Request) {
  const location = (await request.json()).location; // Extract location from request body

  if (!location) {
    return NextResponse.json(
      { error: "Location parameter is required." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://test.lilaclabs.ai/lilac-agent/start",
      {
        location, // Send location in the body
      },
      {
        headers: {
          "x-api-key": `Bearer ${process.env.API_TOKEN}`, // Use your API token from environment variables
        },
      }
    );

    return NextResponse.json({ orderId: response.data.orderId });
  } catch (error) {
    console.error("Error calling external API:", error);
    return NextResponse.json(
      { error: "Error starting order" },
      { status: 500 }
    );
  }
}
