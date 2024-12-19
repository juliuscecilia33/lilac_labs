import axios from "axios";

const API_URL = "https://test.lilaclabs.ai/lilac-agent";
const API_TOKEN =
  "9fc329f2634583c715d723236dd3e539b3f079cbbca4590900417922344aec16";

// export async function startOrder(location: string) {
//   try {
//     const response = await axios.get(`${API_URL}/start`, {
//       headers: { "x-api-key": `Bearer ${API_TOKEN}` },
//       params: { location },
//     });
//     return response.data; // Return orderId
//   } catch (error) {
//     console.error("Error starting order:", error);
//     throw error;
//   }
// }
export async function startOrder(location: string) {
  try {
    const response = await axios.get(`/api/lilac-agent/start`, {
      headers: { "x-api-key": `Bearer ${API_TOKEN}` },
      params: { location },
    });
    console.log(response.data);
    return response.data; // Return orderId
  } catch (error) {
    console.error("Error starting order:", error);
    throw error;
  }
}

export async function sendMessage(
  orderId: string,
  input: string,
  location: string
) {
  try {
    const response = await axios.post(
      `${API_URL}/chat`,
      {
        orderId,
        input,
        location,
      },
      {
        headers: { "x-api-key": `Bearer ${API_TOKEN}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function retrieveOrder(orderId: string) {
  try {
    const response = await axios.get(`${API_URL}/order`, {
      headers: { "x-api-key": `Bearer ${API_TOKEN}` },
      params: { orderId },
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving order:", error);
    throw error;
  }
}
