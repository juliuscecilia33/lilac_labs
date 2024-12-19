import { NextResponse } from "next/server";
import axios from "axios";

type Data = {
  orderId?: string;
  error?: string;
};

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

    console.log("backend response", response.data);

    return NextResponse.json({ chatResponse: response.data });
  } catch (error) {
    console.error("Error calling external API:", error);
    return NextResponse.json(
      { error: "Error sending order message" },
      { status: 500 }
    );
  }
}
