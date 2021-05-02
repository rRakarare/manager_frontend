import React, { useRef, useEffect } from "react";
import {
  Menu,
  Container,
  Header,
  Icon,
  Image,
  Segment,
  Sidebar,
  Dropdown,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

function Nav({ children }) {
  const [visible, setVisible] = React.useState(false);
  const header = useRef();
  let top = 54.6;

  useEffect(() => {
    console.log(header.current.clientHeight);
  }, []);

  return (
    <>
      <div ref={header}>
        <Menu style={{ margin: 0 }}>
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
            <h3>asdqwe</h3>
          </Menu.Item>
          <Menu.Menu position="right">
            <Dropdown item text="Categories">
              <Dropdown.Menu>
                <Dropdown.Item>Electronics</Dropdown.Item>
                <Dropdown.Item>Automotive</Dropdown.Item>
                <Dropdown.Item>Home</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </div>
      <Sidebar.Pushable style={{ minHeight: `calc(100vh - ${top}px)` }}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="thin"
          style={{ backgroundColor: "white" }}
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

        <Sidebar.Pusher>{children}</Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
}

export default Nav;
