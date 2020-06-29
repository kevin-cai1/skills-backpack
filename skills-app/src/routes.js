// add new routes here

import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import Register from './registration-forms';
import App from './App';
import PrivateRoute from './PrivateRoute';
import ChangePassword from './changePassword';
import Navbar from './Navbar';
import Home from './home'
import Course_Create from './course-create-forms';
import Manage_Courses from './manage_courses';
import AdminInvite from './AdminInvite';

const allRoutes = () => (
    <Router>
        <Navbar/>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/:email" component={AdminInvite} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/course_create" component={Course_Create}/>
        <PrivateRoute exact path="/manage_courses" component={Manage_Courses}/>
    </Router>
);

export default allRoutes;
