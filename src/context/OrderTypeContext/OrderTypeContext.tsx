import React, { createContext, useContext, useState, useEffect } from "react";

export type OrderType = string;

interface OrderTypeContextType {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

const OrderTypeContext = createContext<OrderTypeContextType>({
  orderType: "",
  setOrderType: () => {},
});

const readInitialOrderType = (): OrderType => {
  const params = new URLSearchParams(window.location.search);
  const urlType = params.get("service_type")?.trim();
  if (urlType) {
    return urlType;
  }
  return sessionStorage.getItem("order_type") || "hall";
};

export const OrderTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderType, setOrderTypeState] = useState<OrderType>(() => readInitialOrderType());

  useEffect(() => {
    const initial = readInitialOrderType();
    if (initial) {
      sessionStorage.setItem("order_type", initial);
      setOrderTypeState(initial);
    }
  }, []);

  const setOrderType = (type: OrderType) => {
    if (type) {
      sessionStorage.setItem("order_type", type);
    } else {
      sessionStorage.removeItem("order_type");
    }
    setOrderTypeState(type);
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = sessionStorage.getItem("order_type") || "";
      setOrderTypeState(saved);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <OrderTypeContext.Provider value={{ orderType, setOrderType }}>
      {children}
    </OrderTypeContext.Provider>
  );
};

export const useOrderType = () => useContext(OrderTypeContext);
