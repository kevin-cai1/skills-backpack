import React, { useEffect } from 'react';
import './home.css'
import SessionDetails from './SessionDetails';
import allRoutes from './routes';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { spacing } from '@material-ui/system';
import { Dialog, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { theme } from './App.js';
import Navbar from "./Navbar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, Tooltip } from 'recharts';

class Home_skillsAdmin extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        course_admin_open: false,
        site_admin_open: false,
        details_open: false,
        change_password: false,
        name_details: '',
        email_details: '',
        password_details: '',
        line_data: [{name: '10/07/2020', candidate: 4, employer: 2, courseAdmin: 4, skillsAdmin: 2}, {name: '11/07/2020', candidate: 5, employer: 4, courseAdmin: 2, skillsAdmin: 1}, {name: '13/07/2020', candidate: 7, employer: 5, courseAdmin: 2, skillsAdmin: 1},],
        bar_data: [{name: 'Candidates', count: 10}, {name: 'Employers', count: 5}, {name: 'Course Admins', count: 8}, {name: 'Skills Admins', count: 3},]
      };
      this.handleLogout = this.handleLogout.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handleCourseAdminModal = this.handleCourseAdminModal.bind(this);
      this.handleSiteAdminModal = this.handleSiteAdminModal.bind(this);
      this.handleCourseAdminModalClose = this.handleCourseAdminModalClose.bind(this);
      this.handleSiteAdminModalClose = this.handleSiteAdminModalClose.bind(this);
      this.handleDetailsOpen = this.handleDetailsOpen.bind(this);
      this.handleDetailsClose = this.handleDetailsClose.bind(this);
      this.handleSkillsAdminLoad = this.handleSkillsAdminLoad.bind(this);
      this.handleInviteSend = this.handleInviteSend.bind(this);
  }

  sleep(time){
        return new Promise((resolve)=>setTimeout(resolve,time));
  }

  componentDidMount() {
      this.sleep(1000).then(()=>{
        this.handleSkillsAdminLoad();
      });
      this.fetchUserCounts();
      this.fetchUserActivity();
  }

  // handlers for all modal opens and closes
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

  handleChangePassword() {
      this.setState({change_password: true});
  }
  //end modal handlers

  handleLogout() {
      SessionDetails.removeEmail();
  }

  //on home page load, load user count stats for dashboard graphs
  fetchUserCounts() {
    return this.getUserCounts().then( (response) => {
      if (response['ok']) {
        this.setState({bar_data: response.data})
      }
    })
  }

  //API handler for above^
  getUserCounts() {
    let url = 'http://127.0.0.1:5000/skills_admin/dash/accounts';

    console.log('Sending to ' + url);

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      console.log(response)
      return response.json();
    }).catch(err => console.log('Error:', err));
  }

  //on home page load, load user activity stats for dashboard graphs
  fetchUserActivity() {
    return this.getUserActivity().then( (response) => {
      if (response['ok']) {
        this.setState({line_data: response.data})
      }
    })
  }

  //API handler for above^
  getUserActivity() {
    let url = 'http://127.0.0.1:5000/skills_admin/dash/activity';

    console.log('Sending to ' + url);

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      console.log(response)
      return response.json();
    }).catch(err => console.log('Error:', err));
  }

  //send invite to course admin via email (handled by API)
  handleInviteSend = (e) => {
      let url = 'http://localhost:5000/course_admin/invite';
      let data = JSON.stringify({
          "skills_email": SessionDetails.getEmail(),
          "course_email": e.target.email.value
      });
      console.log('Sending to ' + url + ': ' + data);
      return fetch(url, {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: data
      }).then(response => {
          console.log('Hello?: ' + response.ok && response.json())
      })
          .catch(err => console.log('Error:', err));
  }

  //change password flow for a first-login skills admin
  handleChangePasswordSubmit = (e) => {
      console.log(this.state.change_password);
      const password = e.target.password.value;
      const errors = this.validatePassword(password);
      if (errors.length == 0) {
          console.log("sendSiteAdminPassword");
          const response = this.sendSiteAdminPassword(e).then( (response) => {
              console.log(response);
              if(response==false){
                  alert("Something went wrong. Contact skillsbackpack@gmail.com");
              }
              else{
                  alert("Password successfully changed");
              }
              this.setState({ change_password: false });
          });
      }
      else {
          alert(errors);
          this.setState({ invalid_password: true });

      }
  }

  validatePassword = (password) => {
      const errors = [];
      if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
          errors.push("Invalid password: Password must be min. 8 characters with at least one lower case and upper case letter and number.")
      }
      console.log("errors: ", errors);
      return errors;
  };

  //update backend new password for a first-login skills admin (API handler)
  sendSiteAdminPassword(e) {
      let data = JSON.stringify({
          "new_password": e.target.password.value
      });
      let url = 'http://localhost:5000/skills_admin/details/' + SessionDetails.getEmail();
      console.log('Sending to ' + url + ': ' + data);

      return fetch(url, {
          method: 'PUT',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          },
          body: data
      }).then(response => {
          return response.ok;
      })
          .catch(err => console.log('Error:', err));
  }

  //checks if this is a first-login for the skills admin (in which case, password needs to be changed)
  handleSkillsAdminLoad() {
    this.sendSkillsAdminLogin().then( (response) => {
        console.log("Login response: " + response.message);
        if(response.message == "Password needs to be updated") {
            this.handleChangePassword();
            console.log("Change password before proceeding");
            this.setState({ change_password: true });
        }
    });
  }

  //API handler for above^
  sendSkillsAdminLogin() {
      let url = 'http://localhost:5000/skills_admin/new/' + SessionDetails.getEmail();
      console.log('Sending to ' + url);

      return fetch(url, {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
      }).then(response => {
          return response.ok && response.json();
      })
          .catch(err => console.log('Error:', err));
  }

  //handler to add a new skills admin account:
  handleFormSubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const errors = this.validateEmail(email);
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

  validateEmail = (email) => {
      const errors = [];
      if(!email.match(/^.+@.+$/i)){
          errors.push("Invalid email.")
      }
      console.log("errors: ", errors);
      return errors;
  };

  //send new skills admin account details to backend
  sendSiteAdmin(e) {
      let data = JSON.stringify({
          "user_type": "skillsAdmin",
          "name": e.target.name.value,
          "email": e.target.email.value,
          "password": ''
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
  //end flow to add new skills admin

  render() {
    return (
      <div className="A-page">
        <Navbar/>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="B-body">
          <div className="B-buttons">
              <MuiThemeProvider theme={theme}>
                <Box m={2}>
                  <Button variant="contained" size="large" color="primary" onClick={this.handleCourseAdminModal}>
                    Invite Course Admins
                  </Button>
                </Box>
                <Box m={2}>
                  <Button variant="contained" size="large" color="secondary" onClick={this.handleSiteAdminModal}>
                    Add Skills Backpack Admin
                  </Button>
                </Box>
              </MuiThemeProvider>
            </div>
            <div className='card-grid'>
              <Grid container justify="center" spacing={2}>
                <Grid item md={7}>
                  <Card>
                    <CardContent>
                      <h3>Site Usage - Login Counts</h3>
                      <ResponsiveContainer width="99%" height={300}>
                        <LineChart data={this.state.line_data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="candidate" stroke="#2D9CDB"/>
                          <Line type="monotone" dataKey="employer" stroke="#20BF55"/>
                          <Line type="monotone" dataKey="courseAdmin" stroke="#ab3428"/>
                          <Line type="monotone" dataKey="skillsAdmin" stroke="#f49e4c"/>
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item md={5}>
                  <Card>
                    <CardContent>
                    <h3>User Numbers</h3>
                      <ResponsiveContainer width="99%" height={300}>
                        <BarChart data={this.state.bar_data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar type="monotone" dataKey="count" fill="#2D9CDB"/>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
        </body>
        <footer className="Home-footer">
          <p>Yuppies 2020 </p>
        </footer>
        <MuiThemeProvider theme={theme}>
          <Dialog
            aria-labelledby="form-dialog-title"
            open={this.state.change_password}
          >
            <DialogContent>
              <form onSubmit={(e) => this.handleChangePasswordSubmit(e)}>
                <Alert severity="warning">
                  Update password to validate your admin account
                </Alert>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="password"
                  name="password"
                  label="New Password"
                  type="password"
                  fullWidth
                />
                <Button type="submit" color="primary">
                  Set
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
        <MuiThemeProvider theme={theme}>
          <Dialog
            aria-labelledby="form-dialog-title"
            open={this.state.course_admin_open}
            onClose={this.handleCourseAdminModalClose}
          >
            <DialogContent>
              <form onSubmit={(e) => this.handleInviteSend(e)}>
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
                <Button onClick={this.handleCourseAdminModalClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Send
                </Button>
              </form>
            </DialogContent>
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
}

export default Home_skillsAdmin;
