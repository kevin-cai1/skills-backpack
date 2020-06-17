import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import allRoutes from './routes';
import './register.css';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './App.js'
import { DatePicker, InlineDatePicker } from "@material-ui/pickers";

class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: null,
        password: null,
        errors: {
          email: '',
          password: '',
        }
      };
    }
    handleChange = (event) => {
      event.preventDefault();
      const { type, value } = event.target;
      let errors = this.state.errors;

      switch (type) {
        case 'email':
          errors.email =
            value.match(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/) == false
              ? 'Invalid email'
              : '';
          break;
        case 'password':
          errors.password =
            value.length < 8 || value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/) == false
              ? 'Password must be 8 characters long with at least one lower case and upper case letter and number'
              : '';
          break;
        default:
          break;
      }

      this.setState({errors, [type]: value}, ()=> {
          console.log(errors)
      })
    }
    render() {
        return (
            <div className="Register-page">
              <header>
                <p>Menu</p>
              </header>
              <body className="Register-body">
                <h1>Sign Up</h1>
                <FormControl fullWidth={true} required={true} margin='normal'>
                  <InputLabel htmlFor="input-name">Full Name</InputLabel>
                  <Input type="text" id="input-name" aria-describedby="my-helper-text"/>
                  <FormHelperText id="my-helper-text">This is how you will appear to employers</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} required={true} margin='normal'>
                  <InputLabel htmlFor="input-email">Email address</InputLabel>
                  <Input type="email" id="input-email" aria-describedby="my-helper-text" onChange={this.handleChange}/>
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
                  <InputLabel htmlFor="input-id">Student ID</InputLabel>
                  <Input type="text" id="input-id" aria-describedby="my-helper-text" />
                  <FormHelperText id="my-helper-text">Help university admins identify you</FormHelperText>
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
                  <Input id="input-password" type="password" aria-describedby="my-helper-text" onChange={this.handleChange}/>
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
              </body>
            </div>
        )
    }
}
export default Register
