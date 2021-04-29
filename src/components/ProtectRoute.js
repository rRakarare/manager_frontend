import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectRoute({component:Component, ...rest}) {

    const token = localStorage.getItem('access_token')
    console.log(token)
    const asd = false

    return (
            <Route {...rest} render={
                props=>{
                    if (token) {
                        return <Component {...rest} {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }
            }/>
            
    )
}

export default ProtectRoute
