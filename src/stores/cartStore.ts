import { atom, computed } from 'nanostores';

export interface CartItem {
  id: string;
  type: '1-month' | '3-month';
  title: string;
  price: number;
  coverStyle: string;
  coverImage?: string;
  customNotes?: string;
  quantity: number;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: 'pickup' | 'shipping';
  shippingAddress?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
}

// Persisted cart state helper
const getInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('thebookstop_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
    return [];
  }
};

export const $cartItems = atom<CartItem[]>(getInitialCart());
export const $isCartOpen = atom<boolean>(false);
export const $isCheckoutOpen = atom<boolean>(false);
export const $confirmedOrder = atom<OrderConfirmation | null>(null);

// Sync to localStorage
if (typeof window !== 'undefined') {
  $cartItems.subscribe((items) => {
    try {
      localStorage.setItem('thebookstop_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  });
}

// Computed totals
export const $cartCount = computed($cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const $cartSubtotal = computed($cartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Actions
export function addToCart(newItem: Omit<CartItem, 'quantity'>, quantity: number = 1) {
  const current = $cartItems.get();
  const existingIndex = current.findIndex((item) => item.id === newItem.id);

  if (existingIndex > -1) {
    const updated = [...current];
    updated[existingIndex].quantity += quantity;
    $cartItems.set(updated);
  } else {
    $cartItems.set([...current, { ...newItem, quantity }]);
  }

  // Auto open cart drawer on add
  $isCartOpen.set(true);
}

export function updateItemQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  const current = $cartItems.get();
  $cartItems.set(
    current.map((item) => (item.id === id ? { ...item, quantity } : item))
  );
}

export function removeFromCart(id: string) {
  const current = $cartItems.get();
  $cartItems.set(current.filter((item) => item.id !== id));
}

export function clearCart() {
  $cartItems.set([]);
}

export function toggleCartDrawer() {
  $isCartOpen.set(!$isCartOpen.get());
}

export function openCartDrawer() {
  $isCartOpen.set(true);
}

export function closeCartDrawer() {
  $isCartOpen.set(false);
}

export function openCheckoutModal() {
  $isCartOpen.set(false);
  $isCheckoutOpen.set(true);
}

export function closeCheckoutModal() {
  $isCheckoutOpen.set(false);
}

export function setConfirmedOrder(order: OrderConfirmation | null) {
  $confirmedOrder.set(order);
}
