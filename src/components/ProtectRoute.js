import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode'

function ProtectRoute({component:Component, ...rest}) {

    const token = localStorage.getItem('access_token')
    const expire = jwtDecode(token).exp
    const dateNow = new Date();
    const time = dateNow.getTime()/1000
    
    const expired = expire < time


    return (
            <Route {...rest} render={
                props=>{
                    if (!expired) {
                        return <Component {...rest} {...props} />
                    } else {
                        return <Redirect to="/login" />
                    }
                }
            }/>
            
    )
}

export default ProtectRoute
