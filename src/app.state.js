import create from "zustand";
import { devtools } from "zustand/middleware";
import jwtDecode from "jwt-decode";

export function checkAuth() {
  const token = localStorage.getItem("access_token");
  if (token) {
    const expire = jwtDecode(token).exp;
    const dateNow = new Date();
    const time = dateNow.getTime() / 1000;

    if (expire > time) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const useAppStore = create(
  devtools((set) => ({
    auth: checkAuth(),
    setAuth: (auth) => set((state) => ({ auth })),

    invoices: [],
    setInvoices: (invoices) => set((state) => ({ invoices })),

    projectdata: {},
    setProjectdata: (projectdata) => set((state) => ({ projectdata })),
  }))
);
