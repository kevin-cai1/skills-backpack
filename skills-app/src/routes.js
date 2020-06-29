// add new routes here

import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import Register from './register';
import App from './App';
import Home from './home';
import AdminInvite from './AdminInvite';
import PrivateRoute from './PrivateRoute';

const allRoutes = () => (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/:email" component={AdminInvite} />
        <PrivateRoute path="/home" component={Home} />
    </Router>
);

export default allRoutes;
