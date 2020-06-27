import React from 'react';
import './course-create-forms.css'
import SessionDetails from './SessionDetails';
import allRoutes from './routes';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { spacing } from '@material-ui/system';
import { FormControl, InputLabel, Input, FormHelperText, MenuItem, Select, AppBar, Chip } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { theme } from './App.js'

class Course_Create extends React.Component {
  render() {
    return(
      <div>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="Page-body">
          <h1>New Course Details</h1>
          <div className="Course-form-body">
            <form>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="uni-select">University</InputLabel>
                <Select name="uni" labelId="uni-select" id="select">
                  <MenuItem value="University of New South Wales">University of New South Wales</MenuItem>
                  <MenuItem value="University of Sydney">University of Sydney</MenuItem>
                  <MenuItem value="University of Technology Sydney">University of Technology Sydney</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="faculty-select">Faculty</InputLabel>
                <Select name="faculty" labelId="faculty-select" id="select">
                  <MenuItem value="Arts and Social Sciences">Arts and Social Sciences</MenuItem>
                  <MenuItem value="Business School">Business School</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Medicine">Medicine</MenuItem>
                  <MenuItem value="Science">Science</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-code">Course Code</InputLabel>
                <Input name="code" type="text" id="input-code" aria-describedby="my-helper-text"/>
                <FormHelperText id="my-helper-text">As it appears in official records</FormHelperText>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-name">Course Name</InputLabel>
                <Input name="name" type="text" id="input-name" aria-describedby="my-helper-text" />
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-link">Course Link</InputLabel>
                <Input name="link" type="text" id="input-link" aria-describedby="my-helper-text" />
                <FormHelperText id="my-helper-text">e.g. Handbook link</FormHelperText>
              </FormControl>
              <FormControl fullWidth={true} margin='normal'>
                <InputLabel htmlFor="input-description">Course Description</InputLabel>
                <Input name="description" id="input-description" type="text" multiline={true} rows={5}/>
                <FormHelperText id="my-helper-text">(Optional) max. 200 words</FormHelperText>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="input-confirm">Graduate Outcomes</InputLabel>
                <Input name="outcomes" id="input-outcomes" type="text" aria-describedby="my-helper-text" />
                <FormHelperText id="my-helper-text">wanna change this to chips</FormHelperText>
              </FormControl>
              <div className="buttons">
                <MuiThemeProvider theme={theme}>
                  <Box m={3}>
                    <Button variant="contained" color="secondary" component={Link} to="./home">
                      Cancel
                    </Button>
                  </Box>
                  <Box m={3}>
                    <Button type="submit" variant="contained" color="primary" component={Link} to="/">
                      Create
                    </Button>
                  </Box>
                </MuiThemeProvider>
              </div>
            </form>
          </div>
        </body>
        <footer className="Home-footer">
            <p>Yuppies 2020 </p>
        </footer>
      </div>
    )
  }
}

export default Course_Create
