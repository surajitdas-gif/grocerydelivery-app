
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

interface CartItem {
  name: string;
  price: number;
  quantity: string;
  image: string;
  qty?: number;
}

interface OrderItem {
  id: string;
  date: string;
  status: string;
  items: CartItem[];
}

interface CartContextType {
  cart: CartItem[];
  orders: OrderItem[];
  addToCart: (item: CartItem) => void;
  increaseQty: (name: string) => void;
  decreaseQty: (name: string) => void;
  checkout: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  orders: [],
  addToCart: () => {},
  increaseQty: () => {},
  decreaseQty: () => {},
  checkout: () => {},
});

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === item.name);

      if (existing) {
        return prev.map((p) =>
          p.name === item.name
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increaseQty = (name: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (name: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name
            ? { ...item, qty: (item.qty || 1) - 1 }
            : item
        )
        .filter((item) => (item.qty || 1) > 0)
    );
  };

  const checkout = () => {
    const newOrder = {
      id: '#' + Math.floor(Math.random() * 100000),
      date: new Date().toLocaleString(),
      status: 'Preparing',
      items: [...cart],
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        increaseQty,
        decreaseQty,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

