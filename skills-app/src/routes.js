// add new routes here

import React from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from 'react-router-dom';
import SessionDetails from './SessionDetails';
import Login from './login';
import Register from './registration-forms';
import App from './App';
import PrivateRoute from './PrivateRoute';
import ChangePassword from './changePassword';
import Navbar from './Navbar';
import Home from './home'
import Course_Create from './course-create-forms';
import AdminInvite from './AdminInvite';
import Candidate_EPortfolio from './candidate-eportfolio';
import Home_skillsAdmin from './home-skillsAdmin';
import Home_courseAdmin from './home-courseAdmin';
import Employer_Profile from './employer-profile';
import Home_Employer from './home-employer';
import View_EPortfolio from './view-eportfolio';
import Link_EPortfolio from './link-eportfolio';
import Home_Candidate from './home-candidate.js';
import SearchEmployer from './searchEmployer';
import View_Employer from './view-employer';

const allRoutes = () => (
    <Router>
        <Route exact path="/" component={App} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/:email" component={AdminInvite} />
        <Route exact path="/eportfolio/:link" component={Link_EPortfolio}/>
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/home-skillsAdmin" component={Home_skillsAdmin} />
        <PrivateRoute path="/home-courseAdmin" component={Home_courseAdmin} />
        <PrivateRoute path="/home-candidate" component={Home_Candidate} />
        <PrivateRoute path="/home-employer" component={Home_Employer} />
        <PrivateRoute path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/course_create" component={Course_Create}/>
        <PrivateRoute exact path="/my-eportfolio" component={Candidate_EPortfolio}/>
        <PrivateRoute exact path="/view-eportfolio/:user" component={View_EPortfolio}/>
            <PrivateRoute exact path="/view-company/:user" component={View_Employer}/>
        <PrivateRoute exact path="/my-profile" component={Employer_Profile}/>
        <PrivateRoute exact path="/search-company" component={SearchEmployer}/>
    </Router>
);

export default allRoutes;
