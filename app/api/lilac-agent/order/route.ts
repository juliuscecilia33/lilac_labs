import { NextResponse } from "next/server";
import axios from "axios";

type Data = {
  orderId?: string;
  error?: string;
};

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
