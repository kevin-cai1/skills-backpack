import React from 'react';
import './home.css'
import SessionDetails from './SessionDetails';
import allRoutes from './routes';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { theme } from './App.js';

class Home_courseAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        SessionDetails.removeEmail();
    }
    render() {
      return (
        <div className="A-page">
          <header className="App-header">
              <h1>Skills Backpack</h1>
          </header>
          <body className="A-body">
              <h1>Welcome to the homepage { SessionDetails.getEmail()}</h1>
              <p>Logged in as: Course Admin</p>
              <div className="A-buttons">
                <MuiThemeProvider theme={theme}>
                  <Box m={3}>
                    <Button variant="contained" color="primary" component={Link} to="/manage_courses">
                      Manage my courses
                    </Button>
                  </Box>
                  <Box m={3}>
                    <Button variant="contained" color="secondary" component={Link} to="/course_create">
                      Create new course
                    </Button>
                  </Box>
                </MuiThemeProvider>
              </div>
              <p><a href='./login' onClick={this.handleLogout}>Logout</a></p>
          </body>
          <footer className="Home-footer">
            <p>Yuppies 2020 </p>
          </footer>
        </div>
      );
    }
}
export default Home_courseAdmin;
