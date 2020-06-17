import React from 'react'
import allRoutes from './routes';
import './register.css';
import Box from '@material-ui/core/Box';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select } from '@material-ui/core';

class Register extends React.Component {
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
                  <Input id="input-name" aria-describedby="my-helper-text" />
                  <FormHelperText id="my-helper-text">This is how you will appear to employers</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} required={true} margin='normal'>
                  <InputLabel htmlFor="input-email">Email address</InputLabel>
                  <Input id="input-email" aria-describedby="my-helper-text" />
                  <FormHelperText id="my-helper-text">University e-mail</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} margin='normal'>
                  <InputLabel htmlFor="uni-select">University</InputLabel>
                  <Select labelId="uni-select" id="select">
                    <MenuItem value="University of New South Wales">University of New South Wales</MenuItem>
                    <MenuItem value="University of Sydney">University of Sydney</MenuItem>
                    <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth={true} required={true} margin='normal'>
                  <InputLabel htmlFor="input-id">Student ID</InputLabel>
                  <Input id="input-id" aria-describedby="my-helper-text" />
                  <FormHelperText id="my-helper-text">Help university admins identify you</FormHelperText>
                </FormControl>
              </body>
            </div>
        )
    }
}
export default Register
