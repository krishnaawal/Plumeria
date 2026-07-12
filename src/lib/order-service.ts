import type { OrderSubmissionPayload, OrderSubmissionResponse } from "@/types/order";

let activeRequest = false;

export async function submitOrder(
  payload: OrderSubmissionPayload
): Promise<OrderSubmissionResponse> {
  if (activeRequest) {
    return {
      success: false,
      message: "An order submission is already in progress. Please wait."
    };
  }

  activeRequest = true;

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let result: OrderSubmissionResponse;

    try {
      result = JSON.parse(text) as OrderSubmissionResponse;
    } catch {
      const looksLikeHtml = text.trim().startsWith("<");

      return {
        success: false,
        message: looksLikeHtml
          ? "The order API returned a webpage instead of JSON. Check that the Apps Script Web App URL ends with /exec, is deployed, and access is set to Anyone."
          : "The order service returned invalid JSON. Paste the latest google-apps-script.js into Apps Script and deploy a new Web App version."
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Unable to save the order."
      };
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Could not connect to the order service. Please try again."
    };
  } finally {
    activeRequest = false;
  }
}
