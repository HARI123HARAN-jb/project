import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface CartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

interface AppState {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  token: null,
  cart: [],
  setUser: (user, token) => {
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ user, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, cart: [] });
  },
  addToCart: (item) => set((state) => {
    const exist = state.cart.find((x) => x.product === item.product);
    if (exist) {
      return { cart: state.cart.map((x) => x.product === exist.product ? item : x) };
    } else {
      return { cart: [...state.cart, item] };
    }
  }),
  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((x) => x.product !== id)
  })),
  clearCart: () => set({ cart: [] })
}));
