import React, { useState, useEffect, useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuth, checkAuth } from "../context/AuthContext";

function ProtectRoute({ component: Component, ...rest }) {
  const [status, setStatus] = useAuth();
  useEffect(() => {
    if (status) {
      setStatus(checkAuth());
    }
    
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (status) {
          return <Component {...rest} {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default ProtectRoute;
