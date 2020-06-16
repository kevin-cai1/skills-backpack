// add new routes here

import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import App from './App';

const allRoutes = () => (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
    </Router>
);

export default allRoutes;