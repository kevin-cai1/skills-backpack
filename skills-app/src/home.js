import React from 'react';
import './home.css'
import SessionDetails from './SessionDetails';
import allRoutes from './routes';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { spacing } from '@material-ui/system';
import { Dialog, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { theme } from './App.js'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        SessionDetails.removeEmail();
    }

    render() {
        if( SessionDetails.getType() === "courseAdmin" ) {
          return ( <Redirect to='./home-courseAdmin'/> );
        }
        else if( SessionDetails.getType() === "skillsAdmin" ) {
          return ( <Redirect to='./home-skillsAdmin'/> );
        }
        else {
            return (
                <body>
                    <h1>Welcome to the homepage { SessionDetails.getEmail()}</h1>
                    <p><a href='./login' onClick={this.handleLogout}>Logout</a></p>
                </body>
            );
        }
    }
}

export default Home;
