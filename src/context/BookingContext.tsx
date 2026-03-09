import React, { createContext, useContext, useState, useCallback } from "react";
import type { AppointmentOrder } from "@/data/mockData";

interface BookingState {
  institutionId: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  couponId?: string;
}

interface BookingContextType {
  booking: Partial<BookingState>;
  setBooking: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booking, setBookingState] = useState<Partial<BookingState>>({});

  const setBooking = useCallback((data: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...data }));
  }, []);

  const resetBooking = useCallback(() => setBookingState({}), []);

  return (
    <BookingContext.Provider value={{ booking, setBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be within BookingProvider");
  return ctx;
};
