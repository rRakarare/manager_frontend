import Nav from "./components/Header";
import LoginForm from "./components/LoginForm";
import ProtectRoute from "./components/ProtectRoute";

import HomeScreen from "./screens/HomeScreen";
import ClientScreen from "./screens/ClientScreen";
import ProjectDetailScreen from "./screens/ProjectDetailScreen";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Nav>
        <div style={{ margin: "2rem" }}>
          <Switch>
            <ProtectRoute exact path="/" component={HomeScreen} />
            <ProtectRoute exact path="/clients" component={ClientScreen} />
            <ProtectRoute
              exact
              path="/projects/:id"
              component={ProjectDetailScreen}
            />
            <Route exact path="/login">
              <LoginForm />
            </Route>
          </Switch>
        </div>
      </Nav>
    </Router>
  );
}

export default App;
