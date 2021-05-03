import React, { useRef, useEffect } from "react";
import {
  Menu,
  Sidebar,
  Dropdown,
  Icon
} from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from '../context/AuthContext'

function Nav({ children }) {
  const [visible, setVisible] = React.useState(false);
  const [status, setStatus] = useAuth()
  const history = useHistory();
  const username = localStorage.getItem('profile_name')

  const logout = () => {
    setStatus(false)
    history.push("/login")
  }

  const UserMenu =  (
    <Menu.Menu position="right">
      <Dropdown item text={username}>
      
        <Dropdown.Menu>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Item onClick={()=>logout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )


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
              <img src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
          </Link>

          <Menu.Item name="features">
            <h3>UBC Data</h3>
          </Menu.Item>
          {status ? UserMenu : null}
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
          style={{ backgroundColor: "white", paddingTop:53.63 }}
          
        >
          <Menu.Item as="a">
            <Icon name="home" />
            Home
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="gamepad" />
            Games
          </Menu.Item>
          <Menu.Item as="a">
            <Icon name="camera" />
            Channels
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher style={{overflow: 'scroll', height: '100vh', paddingTop:53.63}}>{children}</Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
}

export default Nav;
