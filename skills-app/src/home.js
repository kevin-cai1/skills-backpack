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
        this.state = {
          course_admin_open: false,
          site_admin_open: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleCourseAdminModal = this.handleCourseAdminModal.bind(this);
        this.handleSiteAdminModal = this.handleSiteAdminModal.bind(this);
        this.handleCourseAdminModalClose = this.handleCourseAdminModalClose.bind(this);
        this.handleSiteAdminModalClose = this.handleSiteAdminModalClose.bind(this);
    }

    handleLogout() {
        SessionDetails.removeEmail();
    }

    handleCourseAdminModal() {
        this.setState({course_admin_open: true});
    }

    handleSiteAdminModal() {
        this.setState({site_admin_open: true});
    }

    handleCourseAdminModalClose() {
        this.setState({course_admin_open: false});
    }

    handleSiteAdminModalClose() {
        this.setState({site_admin_open: false});
    }

    render() {
        if( SessionDetails.getType() === "course_admin" ) {
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
        if( SessionDetails.getType() === "site_admin" ) {
          return (
            <div className="A-page">
              <header className="App-header">
                  <h1>Skills Backpack</h1>
              </header>
              <body className="A-body">
                  <h1>Welcome to the homepage { SessionDetails.getEmail()}</h1>
                  <p>Logged in as: Skills Backpack Admin</p>
                  <div className="A-buttons">
                    <MuiThemeProvider theme={theme}>
                      <Box m={3}>
                        <Button variant="contained" color="primary" onClick={this.handleCourseAdminModal}>
                          Invite Course Admins
                        </Button>
                      </Box>
                      <Box m={3}>
                        <Button variant="contained" color="secondary" onClick={this.handleSiteAdminModal}>
                          Add Skills Backpack Admin
                        </Button>
                      </Box>
                    </MuiThemeProvider>
                  </div>
                  <p><a href='./login' onClick={this.handleLogout}>Logout</a></p>
              </body>
              <footer className="Home-footer">
                <p>Yuppies 2020 </p>
              </footer>
              <MuiThemeProvider theme={theme}>
                <Dialog
                  aria-labelledby="form-dialog-title"
                  open={this.state.course_admin_open}
                  onClose={this.handleCourseAdminModalClose}
                >
                  <DialogContent>
                    <DialogContentText type="title" id="modal-title">
                      Send invite link to course admin email
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCourseAdminModalClose} color="primary">
                      Cancel
                    </Button>
                    <Button color="primary">
                      Send
                    </Button>
                  </DialogActions>
                </Dialog>
              </MuiThemeProvider>
              <MuiThemeProvider theme={theme}>
                <Dialog
                  aria-labelledby="form-dialog-title"
                  open={this.state.site_admin_open}
                  onClose={this.handleSiteAdminModalClose}
                >
                  <DialogContent>
                    <DialogContentText type="title" id="modal-title">
                      New Skills Backpack admin details
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                    />
                    <TextField
                      margin="dense"
                      id="temp-password"
                      name="temp-password"
                      label="Temporary Password"
                      type="text"
                      helperText="User will be prompted to change password on first login"
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleSiteAdminModalClose} color="primary">
                      Cancel
                    </Button>
                    <Button color="primary">
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              </MuiThemeProvider>
            </div>
          );
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
