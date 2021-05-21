import React, { useEffect} from "react";
import { Route, Redirect } from "react-router-dom";
import {useAppStore, checkAuth} from '../app.state'



function ProtectRoute({ component: Component, ...rest }) {

  const auth = useAppStore(state=>state.auth)
  const setAuth = useAppStore(state=>state.setAuth)


  useEffect(() => {
    if (auth) {
      setAuth(checkAuth())
    }
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth) {
          return <Component {...rest} {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

export default ProtectRoute;
