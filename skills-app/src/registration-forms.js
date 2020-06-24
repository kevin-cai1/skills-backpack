import React, { useState } from 'react'
import { Link, Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import allRoutes from './routes';
import './register.css';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select, Tabs, Tab, AppBar } from '@material-ui/core';
import "react-tabs/style/react-tabs.css";
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './App.js'
import { DatePicker, InlineDatePicker } from "@material-ui/pickers";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


class Register extends React.Component {
    constructor(props){
       super(props);

       this.state = {
           value: 0,
           redirect: null
       }
       this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleChangeIndex = index => {
      this.setState({ value: index });
    };

    createAccount = (e, type) => {
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;
        if(type == "site-admin") {
          console.log("site-admin!");
          console.log(name);
          console.log(email);
          console.log(password);
          this.setState({redirect: 1});
        }
        else if (type == "course-admin") {
          const title = e.target.title.value;
          const uni = e.target.uni.value;
          console.log("course-admin!");
          console.log(name);
          console.log(email);
          console.log(password);
          console.log(title);
          console.log(uni);
          this.setState({redirect: 1});
        }
        else if (type == "student") {
          const uni = e.target.uni.value;
          const degree = e.target.degree.value;
          const graduation = e.target.graduation.value;
          console.log("student!");
          this.setState({redirect: 1});
          console.log(name);
          console.log(email);
          console.log(password);
          console.log(uni);
          console.log(degree);
          console.log(graduation);
        }
        else if (type == "employer") {
          console.log("employer!");
          this.setState({redirect: 1});
          console.log(name);
          console.log(email);
          console.log(password);
          console.log(company);
        }
        else {
          alert("Something went wrong. Try again later.");
        }
    }

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
        return errors;
    };

    handleFormSubmit = (e, type) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;
        const errors = this.validate(email, password, confirm);
        if (errors.length == 0) {
            this.createAccount(e, type);
            alert("Your account has been created.");
        }
        else {
            alert(errors);
        }
        console.log(email);
        console.log(password);
        console.log(confirm);
    };

    ItemOne = theme => {
      return (
          <div>
            <form onSubmit={(e) => this.handleFormSubmit(e, "site-admin")}>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-name">Full Name</InputLabel>
                <Input type="text" id="input-name" name="name"/>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-email">Email address</InputLabel>
                <Input type="email" id="input-email" name="email"/>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-password">Password</InputLabel>
                <Input id="input-password" name="password" type="password" aria-describedby="my-helper-text"/>
                <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
                <Input id="input-confirm" type="password" aria-describedby="my-helper-text" name="confirm"/>
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

    ItemTwo = theme => {
      return (
        <div>
          <form onSubmit={(e) => this.handleFormSubmit(e, "course-admin")}>
            <FormControl style={{minWidth:100}} required={true} margin='normal'>
              <InputLabel htmlFor="title-select">Title</InputLabel>
              <Select name="title" labelId="title-select" id="select">
                <MenuItem value="Dr">Dr</MenuItem>
                <MenuItem value="Prof">Dr</MenuItem>
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Ms">Ms</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth={true} required={true} margin='normal'>
              <InputLabel htmlFor="input-name">Full Name</InputLabel>
              <Input name="name" type="text" id="input-name"/>
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
                <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
              </Select>
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
                <Button type="submit" variant="contained" color="primary" component={Link} to="./login">
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
        <div>
          <form onSubmit={(e) => this.handleFormSubmit(e, "student")}>
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
                <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
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
                <Button type="submit" variant="contained" color="primary" component={Link} to="./login">
                  Sign Up
                </Button>
              </Box>
            </MuiThemeProvider>
          </form>
        </div>
      );
    }

    ItemFour = theme => {
      return (
        <div>
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
                <Button type="submit" variant="contained" color="primary" component={Link} to="./login">
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
              <Redirect to='./login'/>
            )
        }
        return (
            <div className="Register-page">
              <header>
                <p>Menu</p>
              </header>
              <body>
                <h1>Sign Up</h1>
                <div className="Register-redirect-container">
                    <p className="Register-redirect-text" style={{alignSelf: "centre"}}>Have an account already? <a href='./login'>Login</a></p>
                </div>
                <MuiThemeProvider theme={theme}>
                  <BrowserRouter>
                    <div className="Page-body">
                      <AppBar position="static" color="default" width="80%">
                        <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          fullWidth
                        >
                          <Tab label="Site Admin" component={Link} to="/one" />
                          <Tab label="Course Admin" component={Link} to="/two" />
                          <Tab label="Student" component={Link} to="/three" />
                          <Tab label="Employer" component={Link} to="/four" />
                        </Tabs>
                      </AppBar>
                    </div>
                    <div className="Register-body">
                      <Switch>
                        <Route path="/one" component={PageShell(this.ItemOne)} />
                        <Route path="/two" component={PageShell(this.ItemTwo)} />
                        <Route path="/three" component={PageShell(this.ItemThree)} />
                        <Route path="/four" component={PageShell(this.ItemFour)} />
                        <Route path="*"><Redirect to="/one"/></Route>
                      </Switch>
                    </div>
                  </BrowserRouter>
                </MuiThemeProvider>
              </body>
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
