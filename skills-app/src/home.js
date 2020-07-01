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
          site_admin_open: false,
          details_open: false,
          name_details: '',
          email_details: '',
          password_details: ''
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCourseAdminModal = this.handleCourseAdminModal.bind(this);
        this.handleSiteAdminModal = this.handleSiteAdminModal.bind(this);
        this.handleCourseAdminModalClose = this.handleCourseAdminModalClose.bind(this);
        this.handleSiteAdminModalClose = this.handleSiteAdminModalClose.bind(this);
        this.handleDetailsOpen = this.handleDetailsOpen.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
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

    handleDetailsOpen() {
        this.setState({details_open: true});
    }

    handleDetailsClose() {
        this.setState({details_open: false});
    }

    sendSiteAdmin(e) {
        let data = JSON.stringify({
            "user_type": "skillsAdmin",
            "name": e.target.name.value,
            "email": e.target.email.value
        });
        let url = 'http://localhost:5000/account/create';
        console.log('Sending to ' + url + ': ' + data);

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(response => {
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    validate = (email) => {
        const errors = [];
        if(!email.match(/^.+@.+$/i)){
            errors.push("Invalid email.")
        }
        console.log("errors: ", errors);
        return errors;
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const errors = this.validate(email);
        if (errors.length == 0) {
            const response = this.sendSiteAdmin(e).then( (response) => {
                console.log('Final response?: ', response);
                this.setState({ name_details: response.account.name })
                this.setState({ email_details: response.account.email })
                this.setState({ password_details: response.account.password })
            });
            if (response === false) {
              alert("Something went wrong. Try again later.");
            }
            else{
              this.handleSiteAdminModalClose();
              this.handleDetailsOpen();
            }

        }
        else {
            alert(errors);
        }
    };

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
                      required
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
                      <form onSubmit={(e) => this.handleFormSubmit(e)}>
                        <DialogContentText type="title" id="modal-title">
                          New Skills Backpack admin details
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="normal"
                          id="name"
                          name="name"
                          label="Full Name"
                          type="text"
                          fullWidth
                        />
                        <TextField
                          required
                          margin="normal"
                          id="email"
                          name="email"
                          label="Email Address"
                          type="email"
                          fullWidth
                        />
                        <Button onClick={this.handleSiteAdminModalClose} color="primary">
                          Cancel
                        </Button>
                        <Button type="submit" color="primary">
                          Create
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
              </MuiThemeProvider>
              <MuiThemeProvider theme={theme}>
                  <Dialog
                    aria-labelledby="form-dialog-title"
                    open={this.state.details_open}
                    onClose={this.handleDetailsClose}
                  >
                    <DialogContent>
                      <DialogContentText type="title" id="modal-title">
                        Admin account has been created!
                      </DialogContentText>
                      <DialogContentText type="title" id="modal-title">
                        Copy below details to login and change password
                      </DialogContentText>
                      <DialogContent>
                        <p>
                          Name: {this.state.name_details}
                        </p>
                        <p>
                          Email: {this.state.email_details}
                        </p>
                        <p>
                          Temporary Password: {this.state.password_details}
                        </p>
                      </DialogContent>
                      <Button onClick={this.handleDetailsClose} color="primary">
                        OK
                      </Button>
                    </DialogContent>
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
