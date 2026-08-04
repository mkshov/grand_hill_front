export interface CartItem {
  cartItemId?: string; // unique identifier: id + size + height
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
  height?: string | null;
  size_id?: number;
}

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (item: CartItem): CartItem[] => {
  const cart = getCart();
  const targetId = item.cartItemId || item.id.toString();
  
  // ensure item has cartItemId set before saving
  const itemToSave = { ...item, cartItemId: targetId };
  
  const existingItem = cart.find((cartItem) => (cartItem.cartItemId || cartItem.id.toString()) === targetId);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(itemToSave);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
  return cart;
};

export const updateCartItemQuantity = (cartItemId: string | number, quantity: number): CartItem[] => {
  const cart = getCart();
  const targetId = cartItemId.toString();
  const updatedCart = cart.map((item) => ((item.cartItemId || item.id.toString()) === targetId ? { ...item, quantity } : item));

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));
  return updatedCart;
};

export const removeFromCart = (cartItemId: string | number): CartItem[] => {
  const cart = getCart();
  const targetId = cartItemId.toString();
  const updatedCart = cart.filter((item) => (item.cartItemId || item.id.toString()) !== targetId);

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("cartUpdated"));
  return updatedCart;
};

export const getCartItemCount = (): number => {
  return getCart().reduce((total, item) => total + item.quantity, 0);
};

export const clearCart = (): void => {
  localStorage.removeItem("cart");
  window.dispatchEvent(new Event("cartUpdated"));
};
