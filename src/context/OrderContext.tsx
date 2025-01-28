import { createContext, useState, useContext, ReactNode } from "react";

interface OrderContextType {
  total: number;
  updateTotal: (amount: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [total, setTotal] = useState<number>(() => {
    const savedTotal = localStorage.getItem("orderTotal");
    return savedTotal ? parseFloat(savedTotal) : 0;
  });

  const updateTotal = (amount: number) => {
    const newTotal = amount < 0 ? 0 : amount;
    setTotal(newTotal);
    localStorage.setItem("orderTotal", newTotal.toString());
  };

  return (
    <OrderContext.Provider value={{ total, updateTotal }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

export default OrderContext;