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
import Candidate_EPortfolio from './candidate-eportfolio';
import Home_skillsAdmin from './home-skillsAdmin';
import Home_courseAdmin from './home-courseAdmin';
import Employer_Profile from './employer-profile';
import Home_Employer from './home-employer';
import View_EPortfolio from './view-eportfolio';

const allRoutes = () => (
    <Router>
        <Navbar/>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/:email" component={AdminInvite} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/home-skillsAdmin" component={Home_skillsAdmin} />
        <PrivateRoute path="/home-courseAdmin" component={Home_courseAdmin} />
        <PrivateRoute path="/home-employer" component={Home_Employer} />
        <PrivateRoute path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/course_create" component={Course_Create}/>
        <PrivateRoute exact path="/manage_courses" component={Manage_Courses}/>
        <PrivateRoute exact path="/my-eportfolio" component={Candidate_EPortfolio}/>
        <PrivateRoute exact path="/view-eportfolio/:user" component={View_EPortfolio}/>
        <PrivateRoute exact path="/my-profile" component={Employer_Profile}/>
    </Router>
);

export default allRoutes;
