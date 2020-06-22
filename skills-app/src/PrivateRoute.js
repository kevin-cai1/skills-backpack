import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import SessionDetails from './SessionDetails';

const PrivateRoute = ({ component: Component, ...rest }) => {

    return (
        <Route
            {...rest}
            render={props =>
                ((SessionDetails.getEmail() != "")) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute