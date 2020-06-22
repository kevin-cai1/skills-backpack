import React, { useState } from 'react'
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import allRoutes from './routes';
import './register.css';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select, Tabs, Tab, Paper, AppBar } from '@material-ui/core';
import "react-tabs/style/react-tabs.css";
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './App.js'
import { DatePicker, InlineDatePicker } from "@material-ui/pickers";
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


class Register extends React.Component {
    state = {
      value: 0
    };

    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleChangeIndex = index => {
      this.setState({ value: index });
    };
    render() {
        const { classes } = this.props;
        return (
            <div className="Register-page">
              <header>
                <p>Menu</p>
              </header>
              <body>
                <h1>Sign Up</h1>
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
                        <Route path="/one" component={PageShell(ItemOne)} />
                        <Route path="/two" component={PageShell(ItemTwo)} />
                        <Route path="/three" component={PageShell(ItemThree)} />
                        <Route path="/four" component={PageShell(ItemFour)} />
                      </Switch>
                    </div>
                  </BrowserRouter>
                </MuiThemeProvider>
              </body>
            </div>
        )
    }
}

function ItemOne(theme) {
  return (
      <div>
        <FormControl fullWidth={true} required={true} margin='normal'>
          <InputLabel htmlFor="input-name">Full Name</InputLabel>
          <Input type="text" id="input-name"/>
        </FormControl>
        <FormControl fullWidth={true} required={true} margin='normal'>
          <InputLabel htmlFor="input-email">Email address</InputLabel>
          <Input type="email" id="input-email"/>
        </FormControl>
        <FormControl fullWidth={true} required={true} margin='normal'>
          <InputLabel htmlFor="input-password">Password</InputLabel>
          <Input id="input-password" type="password" aria-describedby="my-helper-text"/>
          <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} required={true} margin='normal'>
          <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
          <Input id="input-confirm" type="password" aria-describedby="my-helper-text" />
        </FormControl>
        <MuiThemeProvider theme={theme}>
          <Box m={3}>
            <Button variant="contained" color="primary" component={Link} to="./login">
              Sign Up
            </Button>
          </Box>
        </MuiThemeProvider>
      </div>
  );
}

function ItemTwo(theme) {
  return (
    <div>
      <FormControl style={{minWidth:100}} required={true} margin='normal'>
        <InputLabel htmlFor="title-select">Title</InputLabel>
        <Select labelId="title-select" id="select">
          <MenuItem value="Dr">Dr</MenuItem>
          <MenuItem value="Prof">Dr</MenuItem>
          <MenuItem value="Mr">Mr</MenuItem>
          <MenuItem value="Mrs">Mrs</MenuItem>
          <MenuItem value="Ms">Ms</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-name">Full Name</InputLabel>
        <Input type="text" id="input-name"/>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-email">Email address</InputLabel>
        <Input type="email" id="input-email" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">University e-mail</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="uni-select">University</InputLabel>
        <Select labelId="uni-select" id="select">
          <MenuItem value="University of New South Wales">University of New South Wales</MenuItem>
          <MenuItem value="University of Sydney">University of Sydney</MenuItem>
          <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-password">Password</InputLabel>
        <Input id="input-password" type="password" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
        <Input id="input-confirm" type="password" aria-describedby="my-helper-text" />
      </FormControl>
      <MuiThemeProvider theme={theme}>
        <Box m={3}>
          <Button variant="contained" color="primary" component={Link} to="./login">
            Sign Up
          </Button>
        </Box>
      </MuiThemeProvider>
    </div>
  );
}

function ItemThree(theme) {
  return (
    <div>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-name">Full Name</InputLabel>
        <Input type="text" id="input-name" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">This is how you will appear to employers</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-email">Email address</InputLabel>
        <Input type="email" id="input-email" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">University e-mail</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="uni-select">University</InputLabel>
        <Select labelId="uni-select" id="select">
          <MenuItem value="University of New South Wales">University of New South Wales</MenuItem>
          <MenuItem value="University of Sydney">University of Sydney</MenuItem>
          <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth={true} margin='normal'>
        <InputLabel htmlFor="input-degree">Degree</InputLabel>
        <Input type="text" id="input-degree" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">(e.g. Bachelor of Commerce/Adv. Science)</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} margin='normal'>
        <InputLabel htmlFor="input-graduation" shrink={true}>Expected Graduation</InputLabel>
        <Input type="date" id="input-graduation" aria-describedby="my-helper-text" />
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-password">Password</InputLabel>
        <Input id="input-password" type="password" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
        <Input id="input-confirm" type="password" aria-describedby="my-helper-text" />
      </FormControl>
      <MuiThemeProvider theme={theme}>
        <Box m={3}>
          <Button variant="contained" color="primary" component={Link} to="./login">
            Sign Up
          </Button>
        </Box>
      </MuiThemeProvider>
    </div>
  );
}

function ItemFour(theme) {
  return (
    <div>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-name">Full Name</InputLabel>
        <Input type="text" id="input-name"/>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-email">Email address</InputLabel>
        <Input type="email" id="input-email"/>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-company">Company</InputLabel>
        <Input type="text" id="input-company"/>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-password">Password</InputLabel>
        <Input id="input-password" type="password" aria-describedby="my-helper-text"/>
        <FormHelperText id="my-helper-text">min. 8 characters with at least one lower case and upper case letter and number</FormHelperText>
      </FormControl>
      <FormControl fullWidth={true} required={true} margin='normal'>
        <InputLabel htmlFor="input-confirm">Confirm Password</InputLabel>
        <Input id="input-confirm" type="password" aria-describedby="my-helper-text" />
      </FormControl>
      <MuiThemeProvider theme={theme}>
        <Box m={3}>
          <Button variant="contained" color="primary" component={Link} to="./login">
            Sign Up
          </Button>
        </Box>
      </MuiThemeProvider>
    </div>
  );
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
