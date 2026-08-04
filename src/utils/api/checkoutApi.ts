const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.smarty.roberto-riera.com";
const CHECKOUT_API = `${BASE_URL}/product/v1/public-rr-products/checkout/`;

export interface CheckoutItem {
  product: number;
  size?: number;
  quantity?: number;
}

export interface CheckoutPayload {
  name: string;
  surname?: string;
  phone: string;
  email: string;
  address?: string;
  comment?: string;
  is_agreed: boolean;
  items: CheckoutItem[];
}

export async function submitCheckout(payload: CheckoutPayload): Promise<any> {
  const res = await fetch(CHECKOUT_API, {
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
