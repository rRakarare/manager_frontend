import React, { useState, useContext, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, setState] = useState(checkAuth());

  const value = [state, setState];
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function checkAuth() {
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

function useAuth() {
  const context = React.useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth, checkAuth };
