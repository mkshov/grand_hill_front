const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.smarty.roberto-riera.com";
const FEEDBACK_API = `${BASE_URL}/company/v1/public-feedback/`;

export interface FeedbackPayload {
  name: string;
  email: string;
  message: string;
  is_agreed: boolean;
  phone?: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<any> {
  const res = await fetch(FEEDBACK_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw { status: res.status, data: errorData };
  }

  return res.json();
}
