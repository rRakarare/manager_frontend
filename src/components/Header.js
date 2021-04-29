import React from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <div>
            <Menu stackable>
                <Link to="/">
                <Menu.Item>
                <img src='https://react.semantic-ui.com/logo.png' />
                </Menu.Item>
                </Link>

                <Menu.Item
                name='features'
                
                >
                Features
                </Menu.Item>

                <Menu.Item
                name='testimonials'
                
                >
                Testimonials
                </Menu.Item>

                <Menu.Item
                name='sign-in'
                                >
                Sign-in
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default Header
