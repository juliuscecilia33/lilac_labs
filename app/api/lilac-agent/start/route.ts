import { NextResponse } from "next/server";
import axios from "axios";

type Data = {
  orderId?: string;
  error?: string;
};

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
