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

    projectsteps: [],
    setProjectsteps: (projectsteps) => set((state) => ({ projectsteps })),

    projectdata: {},
    setProjectdata: (projectdata) => set((state) => ({ projectdata })),

    cropImage: null,
    setCropImage: (cropImage) => set((state) => ({cropImage})),

    cropModalOpen: false,
    setCropModalOpen: (cropModalOpen) => set((state) => ({cropModalOpen})),

    openClient: false,
    setOpenClient: (openClient) => set((state) => ({openClient})),

    projectModalOpen: false,
    setProjectModalOpen: (projectModalOpen) => set((state) => ({projectModalOpen})),

    editModalOpen: false,
    setEditModalOpen: (editModalOpen) => set((state) => ({editModalOpen})),

  }))
);
