// add new routes here

import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import Register from './register';
import App from './App';
import Home from './home';
import PrivateRoute from './PrivateRoute';

const allRoutes = () => (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute path="/home" component={Home} />
    </Router>
);

export default allRoutes;
