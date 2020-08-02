import React, { useState } from 'react'
import { Link, Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import allRoutes from './routes';
import './register.css';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select, Tabs, Tab, AppBar } from '@material-ui/core';
import "react-tabs/style/react-tabs.css";
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './App'
import { DatePicker, InlineDatePicker } from "@material-ui/pickers";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Navbar from "./Navbar";


class Register extends React.Component {

    constructor(props){
       super(props);

       this.state = {
           value: 0,
           redirect: null,
           errors: [],
           validation_error: false
       }
       this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    //handle tab switches on registration page
    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleChangeIndex = index => {
      this.setState({ value: index });
    };
    //end handle tab switches

    //send details of new course admin to backend
    sendCourseAdmin(e, type) {
        let data = JSON.stringify({
            "user_type": type,
            "name": e.target.name.value,
            "email": e.target.email.value,
            "password": e.target.password.value,
            "university": e.target.uni.value
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
            console.log('response ' + response.status)
            return response.ok && response.json();

        })
            .catch(err => console.log('Error:', err));
    }

    //send details of new candidate to backend
    sendCandidate(e, type) {
        let data = JSON.stringify({
            "user_type": type,
            "name": e.target.name.value,
            "email": e.target.email.value,
            "password": e.target.password.value,
            "university": e.target.uni.value,
            "degree": e.target.degree.value,
            "gradYear": e.target.graduation.value
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
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    //send details of new employer to backend
    sendEmployer(e, type) {
        let data = JSON.stringify({
            "user_type": type,
            "name": e.target.name.value,
            "email": e.target.email.value,
            "password": e.target.password.value,
            "company": e.target.company.value
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
            console.log('response ' + response);
            console.log('response stat HELLO?? ' + response.status);
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    //at form submission, handle validation then send to API handlers
    handleFormSubmit = (e, type) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;
        const errors = this.validate(email, password, confirm);
        if (errors.length == 0) {
            const response = this.createAccount(e, type);
            if (response === false) {
              alert("Something went wrong. Try again later.");
            }
            else{
              alert("Your account has been created!");
            }

        }
        else {
            this.setState({ errors: errors });
            this.setState({ validation_error: true });
        }
        console.log(email);
        console.log(password);
        console.log(confirm);
    };

    //determine account type and send to appropriate account creation flow
    createAccount = (e, type) => {
        console.log(type);
        if (type == "courseAdmin") {
          const uni = e.target.uni.value;
          console.log("courseAdmin!");
          this.setState({redirect: 1});
          return this.sendCourseAdmin(e, type).then( (response) => {
              console.log(response);
          });
        }
        else if (type == "candidate") {
          console.log("student!");
          this.setState({redirect: 1});
          return this.sendCandidate(e, type).then( (response) => {
              console.log(response);
          });
        }
        else if (type == "employer") {
          console.log("employer!");
          this.setState({redirect: 1});
          return this.sendEmployer(e, type).then( (response) => {
              console.log(response);
          });
        }
        else {
          return false;
        }
    }

    //all input validation
    validate = (email, password, confirm) => {
        const errors = [];
        if(!email.match(/^.+@.+$/i)){
            errors.push("Invalid email.")
        }
        else if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
            errors.push("Invalid password: Password must be min. 8 characters with at least one lower case and upper case letter and number.")
        }
        else if(confirm != password) {
            errors.push("Passwords do not match.")
        }
        console.log("errors: ", errors);
        return errors;
    };

    //Items One, Two and Three return the front-end form for each tab switch on registration page
    ItemOne = theme => {
      return (
        <div className="Error-body">
          <Alert severity="error">Contact skillsbackpack@gmail.com to receive an invitation to a course admin account</Alert>
        </div>
      );
    }

    ItemTwo = theme => {
      return (
        <div className="Register-body">
          { this.state.validation_error && <div className="Error-div"><Alert severity="error">
            { this.state.errors }
          </Alert></div>}
          <form onSubmit={(e) => this.handleFormSubmit(e, "candidate")}>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-name">Full Name</InputLabel>
              <Input name="name" type="text" id="input-name" aria-describedby="my-helper-text"/>
              <FormHelperText id="my-helper-text">This is how you will appear to employers</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-email">Email address</InputLabel>
              <Input name="email" type="email" id="input-email" aria-describedby="my-helper-text"/>
              <FormHelperText id="my-helper-text">University e-mail</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="uni-select">University</InputLabel>
              <Select name="uni" labelId="uni-select" id="select">
                <MenuItem value="University of New South Wales">University of New South Wales</MenuItem>
                <MenuItem value="University of Sydney">University of Sydney</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth={true} margin='normal'>
              <InputLabel htmlFor="input-degree">Degree</InputLabel>
              <Input name="degree" type="text" id="input-degree" aria-describedby="my-helper-text" />
              <FormHelperText id="my-helper-text">(e.g. Bachelor of Commerce/Adv. Science)</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} margin='normal'>
              <InputLabel htmlFor="input-graduation" shrink={true}>Expected Graduation</InputLabel>
              <Input name="graduation" type="date" id="input-graduation" aria-describedby="my-helper-text" />
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-password">Password</InputLabel>
              <Input name="password" id="input-password" type="password" aria-describedby="my-helper-text"/>
              <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
              <Input name="confirm" id="input-confirm" type="password" aria-describedby="my-helper-text" />
            </FormControl>
            <MuiThemeProvider theme={theme}>
              <Box m={3}>
                <Button type="submit" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Box>
            </MuiThemeProvider>
          </form>
        </div>
      );
    }

    ItemThree = theme => {
      return (
        <div className="Register-body">
          { this.state.validation_error && <div className="Error-div"><Alert severity="error">
            { this.state.errors }
          </Alert></div>}
          <form onSubmit={(e) => this.handleFormSubmit(e, "employer")}>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-name">Full Name</InputLabel>
              <Input name="name" type="text" id="input-name"/>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-email">Email address</InputLabel>
              <Input name="email" type="email" id="input-email"/>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-company">Company</InputLabel>
              <Input name="company" type="text" id="input-company"/>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-password">Password</InputLabel>
              <Input name="password" id="input-password" type="password" aria-describedby="my-helper-text"/>
              <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
              <Input name="confirm" id="input-confirm" type="password" aria-describedby="my-helper-text" />
            </FormControl>
            <MuiThemeProvider theme={theme}>
              <Box m={3}>
                <Button type="submit" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Box>
            </MuiThemeProvider>
          </form>
        </div>
      );
    }
    render() {
        if(this.state.redirect) {
            return (
              <Redirect to='./home'/>
            )
        }
        return (
            <div className="App">
              <Navbar/>
              <header className="App-header">
                  <h1>Skills Backpack</h1>
              </header>
              <body>
                <h1>Sign Up</h1>
                <div className="Register-redirect-container">
                    <p className="Register-redirect-text" style={{alignSelf: "centre"}}>Have an account already? <a href='./login'>Login</a></p>
                </div>
                <MuiThemeProvider theme={theme}>
                  <BrowserRouter>
                    <div className="Contain-body">
                      <AppBar position="static" color="default" width="30%">
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          fullWidth
                        >
                          <Tab label="Course Admin" component={Link} to="/one" />
                          <Tab label="Student" component={Link} to="/two" />
                          <Tab label="Employer" component={Link} to="/three" />
                        </Tabs>
                      </AppBar>
                    </div>
                    <div>
                      <Switch>
                        <Route path="/one" component={PageShell(this.ItemOne)} />
                        <Route path="/two" component={PageShell(this.ItemTwo)} />
                        <Route path="/three" component={PageShell(this.ItemThree)} />
                        <Route path="*"><Redirect to="/one"/></Route>
                      </Switch>
                    </div>
                  </BrowserRouter>
                // </MuiThemeProvider>
              </body>
              <footer className="Home-footer">
                  <p>Yuppies 2020 </p>
              </footer>
            </div>
        )
    }
}

const PageShell = (Page, previous) => {
  return props => (
    <div className="page">
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={600}
        transitionName={props.match.path === "/one" ? "SlideIn" : "SlideOut"}
      >
        {console.log(props)}
        <Page {...props} />
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default Register
