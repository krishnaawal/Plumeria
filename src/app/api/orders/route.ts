import { NextResponse } from "next/server";
import type { OrderSubmissionPayload, OrderSubmissionResponse } from "@/types/order";

export async function POST(request: Request) {
  const endpoint = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL;

  if (!endpoint || endpoint.includes("YOUR_DEPLOYMENT_ID")) {
    return NextResponse.json(
      {
        success: false,
        message: "Order API is not configured. Add NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in .env.local."
      } satisfies OrderSubmissionResponse,
      { status: 500 }
    );
  }

  let payload: OrderSubmissionPayload;

  try {
    payload = (await request.json()) as OrderSubmissionPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid order request." } satisfies OrderSubmissionResponse,
      { status: 400 }
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text) as OrderSubmissionResponse;
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch {
      const looksLikeHtml = text.trim().startsWith("<");

      return NextResponse.json(
        {
          success: false,
          message: looksLikeHtml
            ? "Apps Script returned a webpage instead of JSON. Confirm the Web App URL ends with /exec and a new version is deployed."
            : "Apps Script returned invalid JSON."
        } satisfies OrderSubmissionResponse,
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not connect to the order service." } satisfies OrderSubmissionResponse,
      { status: 502 }
    );
  }
}
