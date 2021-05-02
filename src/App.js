import { useState } from "react";
import Nav from "./components/Header";
import LoginForm from "./components/LoginForm";
import ProtectRoute from "./components/ProtectRoute";
import { AuthProvider } from "./context/AuthContext";

import Home from "./screens/Home";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav>
          <Switch>
            <ProtectRoute asd="asdqwe123" exact path="/" component={Home} />
            <Route exact path="/asd">
              asdqwe
            </Route>
            <Route exact path="/login">
              <LoginForm />
            </Route>
          </Switch>
        </Nav>
      </Router>
    </AuthProvider>
  );
}

export default App;
