
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  'http://172.20.10.3:5000';

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

  addToCart: (
    item: CartItem
  ) => void;

  increaseQty: (
    name: string
  ) => void;

  decreaseQty: (
    name: string
  ) => void;

  checkout: () => void;

  clearCart: () => void;
}

const CartContext =
  createContext<CartContextType>({
    cart: [],

    orders: [],

    addToCart: () => {},

    increaseQty: () => {},

    decreaseQty: () => {},

    checkout: () => {},

    clearCart: () => {},
  });

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [orders, setOrders] =
    useState<OrderItem[]>([]);

  const [userId, setUserId] =
    useState('');

  // =====================================================
  // LOAD USER CART
  // =====================================================

  useEffect(() => {

    loadUserCart();

  }, []);

  const loadUserCart =
    async () => {

    try {

      const userData =
        await AsyncStorage.getItem(
          'user'
        );

      // LOGGED OUT

      if (!userData) {

        setUserId('');

        setCart([]);

        setOrders([]);

        return;
      }

      const parsed =
        JSON.parse(userData);

      const uid =
        parsed._id;

      setUserId(uid);

      // =========================================
      // LOAD CART FROM BACKEND
      // =========================================

      const cartRes =
        await fetch(
          `${API_URL}/api/cart/${uid}`
        );

      const cartData =
        await cartRes.json();

      setCart(
        cartData.items || []
      );

    } catch (error) {

      console.log(
        'Cart load error:',
        error
      );
    }
  };

  // =====================================================
  // SAVE CART TO BACKEND
  // =====================================================

  useEffect(() => {

    saveCartToBackend();

  }, [cart]);

  const saveCartToBackend =
    async () => {

    try {

      if (!userId) return;

      await fetch(
        `${API_URL}/api/cart/save`,
        {

          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({

            userId,

            items: cart,
          }),
        }
      );

    } catch (error) {

      console.log(
        'Cart save error:',
        error
      );
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (
    item: CartItem
  ) => {

    setCart((prev) => {

      const existing =
        prev.find(
          (p) =>
            p.name === item.name
        );

      if (existing) {

        return prev.map((p) =>

          p.name === item.name

            ? {
                ...p,

                qty:
                  (p.qty || 1) + 1,
              }

            : p
        );
      }

      return [
        ...prev,

        {
          ...item,

          qty: 1,
        },
      ];
    });
  };

  // =====================================================
  // INCREASE
  // =====================================================

  const increaseQty = (
    name: string
  ) => {

    setCart((prev) =>

      prev.map((item) =>

        item.name === name

          ? {
              ...item,

              qty:
                (item.qty || 1) + 1,
            }

          : item
      )
    );
  };

  // =====================================================
  // DECREASE
  // =====================================================

  const decreaseQty = (
  name: string
) => {

  setCart((prev) =>

    prev
      .map((item) => {

        if (item.name === name) {

          return {
            ...item,

            qty:
              (item.qty ?? 1) - 1,
          };
        }

        return item;
      })

      .filter(
        (item) =>
          (item.qty ?? 1) > 0
      )
  );
};

  // =====================================================
  // CHECKOUT
  // =====================================================

  const checkout = () => {

    const newOrder = {

      id:
        '#' +
        Math.floor(
          Math.random() * 100000
        ),

      date:
        new Date().toLocaleString(),

      status: 'Preparing',

      items: [...cart],
    };

    setOrders((prev) => [
      ...prev,
      newOrder,
    ]);

    setCart([]);
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {

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

        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);