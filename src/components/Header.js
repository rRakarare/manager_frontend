import React from 'react'
import { Menu, Container,
    Header,
    Icon,
    Image,
    Segment,
    Sidebar, } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Nav({children}) {


    const [visible, setVisible] = React.useState(false)


    return (
        <div>
            <Menu style={{margin:0}}>
                <Menu.Item onClick={() => {setVisible(!visible)}}>
                <i  className="fas fa-bars"></i>
                </Menu.Item>
              
                <Link to="/">
                <Menu.Item>
                <img src='https://react.semantic-ui.com/logo.png' />
                </Menu.Item>
                </Link>

                <Menu.Item
                name='features'
                
                >
                <h3>asdqwe</h3>
                </Menu.Item>



            </Menu>
            <Sidebar.Pushable style={{minHeight:"100vh"}}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    onHide={() => setVisible(false)}
                    vertical
                    visible={visible}
                    width='thin'
                >
                    <Menu.Item as='a'>
                    <Icon name='home' />
                    Home
                    </Menu.Item>
                    <Menu.Item as='a'>
                    <Icon name='gamepad' />
                    Games
                    </Menu.Item>
                    <Menu.Item as='a'>
                    <Icon name='camera' />
                    Channels
                    </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher>
                   
                    {children}

                </Sidebar.Pusher>
                </Sidebar.Pushable>
        </div>
    )
}

export default Nav
