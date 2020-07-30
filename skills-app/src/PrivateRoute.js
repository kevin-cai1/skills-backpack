import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import SessionDetails from './SessionDetails';

// component for creating a private route
// checks if a user is logged in before allowing access to private routes
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