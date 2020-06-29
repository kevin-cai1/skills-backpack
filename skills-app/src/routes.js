// add new routes here

import React from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import Login from './login';
import Register from './registration-forms';
import App from './App';
<<<<<<< HEAD
import Home from './home';
import AdminInvite from './AdminInvite';
import PrivateRoute from './PrivateRoute';
=======
import Home from './home'
import Course_Create from './course-create-forms';
import Manage_Courses from './manage_courses';
>>>>>>> master

const allRoutes = () => (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
<<<<<<< HEAD
        <Route exact path="/register/:email" component={AdminInvite} />
        <PrivateRoute path="/home" component={Home} />
=======
        <Route exact path="/home" component={Home}/>
        <Route exact path="/course_create" component={Course_Create}/>
        <Route exact path="/manage_courses" component={Manage_Courses}/>
>>>>>>> master
    </Router>
);

export default allRoutes;
