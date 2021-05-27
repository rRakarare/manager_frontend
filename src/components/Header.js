import React from "react";
import { Menu, Sidebar, Dropdown, Icon } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { useAppStore } from "../app.state";

function Nav({ children }) {
  const [visible, setVisible] = React.useState(false);
  const auth = useAppStore((state) => state.auth);
  const setAuth = useAppStore((state) => state.setAuth);

  const history = useHistory();
  const username = localStorage.getItem("profile_name");

  const logout = () => {
    setAuth(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("profile_name");
    history.push("/login");
  };

  const UserMenu = (
    <Menu.Menu position="right">
      <Dropdown item text={username}>
        <Dropdown.Menu>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );

  return (
    <>
      <div>
        <Menu style={{ margin: 0 }} fixed="top">
          <Menu.Item
            onClick={() => {
              setVisible(!visible);
            }}
          >
            <i className="fas fa-bars"></i>
          </Menu.Item>

          <Link to="/">
            <Menu.Item>
              <img src="/ubc.svg" alt="logo" />
            </Menu.Item>
          </Link>

          <Menu.Item name="features">
            <h3>UBC Data</h3>
          </Menu.Item>
          {auth ? UserMenu : null}
        </Menu>
      </div>
      <Sidebar.Pushable style={{}}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          vertical
          visible={visible}
          width="thin"
          style={{ backgroundColor: "white", paddingTop: 53.63 }}
        >
          
            <Menu.Item as={Link} to="/">
              <Icon name="home" />
              Home
            </Menu.Item>
          
          
            <Menu.Item as={Link} to="/clients">
              <Icon name="gamepad" />
              Kunden
            </Menu.Item>
          
          <Menu.Item as={Link} to="/">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher
          style={{ overflow: "scroll", height: "100vh", paddingTop: 53.63 }}
        >
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
}

export default Nav;
