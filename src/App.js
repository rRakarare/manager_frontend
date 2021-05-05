import { useState } from "react";
import Nav from "./components/Header";
import LoginForm from "./components/LoginForm";
import ProtectRoute from "./components/ProtectRoute";
import { AuthProvider } from "./context/AuthContext";

import Home from "./screens/Home";
import ProjectDetail from "./screens/ProjectDetail";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav>
          <Switch>
            <ProtectRoute asd="asdqwe123" exact path="/" component={Home} />
            <ProtectRoute asd="asdqwe123" exact path="/projects/:id" component={ProjectDetail} />
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
