import Header from './components/Header'
import LoginForm from './components/LoginForm'
import ProtectRoute from './components/ProtectRoute'
import Home from './screens/Home'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Header/>
      <Switch>
      <ProtectRoute asd="asdqwe123" exact path="/" component={Home}/>
      <Route exact path="/asd">asdqwe</Route>
      <Route exact path="/login"><LoginForm/></Route>
      </Switch>
    </Router>
  );
}

export default App;
