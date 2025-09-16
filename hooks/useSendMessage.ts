import { useState } from "react";

type SendMessageRequest = {
  body: string;
  orderId: string;
};

type SendMessageResponse = {
  success: boolean;
  error?: string;
};

type UseSendMessageReturn = {
  sendMessage: (request: SendMessageRequest) => Promise<SendMessageResponse>;
  loading: boolean;
  error: string | null;
};

export function useSendMessage(): UseSendMessageReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://www.aliciapceramics.com";
      console.log("Sending message to:", `${baseUrl}/api/newMessage`);
      console.log("Request payload:", JSON.stringify(request));

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${baseUrl}/api/newMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("Response data:", JSON.stringify(data));

      if (!response.ok) {
        const errorMessage = data.error || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (err) {
      console.error("Error sending message:", err);

      let errorMessage = "Failed to send message";

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = "Request timed out after 5 seconds. Please check your internet connection.";
        } else if (err.message.includes('Network request failed')) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}