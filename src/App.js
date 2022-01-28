import { useMediaQuery } from 'react-responsive'

import Nav from "./components/Header";
import LoginForm from "./components/LoginForm";
import ProtectRoute from "./components/ProtectRoute";

import HomeScreen from "./screens/HomeScreen";
import ClientScreen from "./screens/ClientScreen";
import ProjectDetailScreen from "./screens/ProjectDetailScreen";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import InvoiceScreen from "./screens/InvoiceScreen";
import ForecastScreen from './screens/ForecastScreen';

function App() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    <Router>
      <Nav>
        <div style={{ margin: isTabletOrMobile ? "1rem" : "2rem" }}>
          <Switch>
            <ProtectRoute exact path="/" component={HomeScreen} />
            <ProtectRoute exact path="/clients" component={ClientScreen} />
            <ProtectRoute exact path="/invoices" component={InvoiceScreen} />
            <ProtectRoute exact path="/forecast" component={ForecastScreen} />
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
