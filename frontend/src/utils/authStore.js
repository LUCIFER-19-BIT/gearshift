import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      bookings: [],
      testDrives: [],

      login: (userData, token) => {
        set({ user: userData });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData)); // Keep for compatibility if needed
        get().fetchBookings();
        get().fetchTestDrives();
      },

      logout: () => {
        set({ user: null, bookings: [], testDrives: [] });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },

      fetchBookings: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const response = await fetch("http://localhost:8001/api/bookings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            set({ bookings: data });
          } else {
            console.error("Failed to fetch bookings:", response.status);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      },

      fetchTestDrives: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
          const response = await fetch("http://localhost:8001/api/testdrives", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            set({ testDrives: data });
          } else {
            console.error("Failed to fetch test drives:", response.status);
          }
        } catch (error) {
          console.error("Error fetching test drives:", error);
        }
      },

      // Initialize on app start
      init: () => {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = JSON.parse(localStorage.getItem("user") || "null");
          if (userData) {
            set({ user: userData });
            get().fetchBookings();
            get().fetchTestDrives();
          }
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
        testDrives: state.testDrives,
      }), // Only persist these
    }
  )
);

export default useAuthStore;
