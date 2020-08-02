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
/* eslint-disable no-use-before-define */
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Navbar from "./Navbar";

class Course_Create extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          allGradOutcomes: [],
          gradOutcomes: [],
          redirect: null
      }
      this.handleCourseAdd = this.handleCourseAdd.bind(this);
      this.handleUniSelect = this.handleUniSelect.bind(this);
      this.sendUniSelect = this.sendUniSelect.bind(this);
  }

  handleUniSelect = (e) => {
    this.sendUniSelect(e);
  }

  //when course admin selects uni, populate graduate outcomes options
  sendUniSelect = (e) => {
    let component = this;
    console.log("selected:", e.target.value);
    let url = 'http://localhost:5000/course/add/' + e.target.value;
    console.log('Sending to ' + url);
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(function(response){ return response.json();
    }).then(function(data) {
          const items = data;
          console.log("items:", items.gradoutcomes);
          component.setState({ allGradOutcomes: items.gradoutcomes });
    })
        .catch(err => console.log('Error:', err));
  }

  //handling chips select/deselect for gradOutcomes Autocomplete element
  onTagsChange = (event, values) => {
    this.setState({
      gradOutcomes: values
    }, () => {
      // This will output an array of objects
      // given by Autocompelte options property.
      console.log(this.state.gradOutcomes);
    });
  }

  //intermediate values handler when course admin submits form
  handleCourseAdd = (e) => {
      e.preventDefault();
      console.log("hello?");
      let dict = JSON.stringify({
        "admin_email": SessionDetails.getEmail(),
        "code": e.target.code.value,
        "university": e.target.uni.value,
        "faculty": e.target.faculty.value,
        "description": e.target.description.value,
        "name": e.target.name.value,
        "link": e.target.link.value,
        "learningOutcomes": e.target.learningOutcomes.value,
        "gradOutcomes": this.state.gradOutcomes
      });
      console.log("Entire dictionary: ", dict);
      this.handleCourseSend(dict);
  }

  fullUniversity(acronym) {
      console.log("hello?");
      if(acronym == "UNSW"){
        return("University of New South Wales");
      }
      if(acronym == "USYD"){
        return("University of Sydney");
      }
      if(acronym == "UTS"){
        return("University of Technology Sydney");
      }
      else{
        return(acronym);
      }
  }

  //add new course (send all new course details to backend)
  handleCourseSend(dict) {
    let component = this;
    let url = 'http://localhost:5000/course/add/add';
    console.log('Sending to ' + url + ': ' + dict);
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: dict
    }).then(function(response){ return response.json();
    }).then(function(data) {
          const items = data;
          console.log("items:", items);
          if(items.ok == true) {
              alert("Course successfully added.");
              component.setState({redirect: 1});
          }
    })
        .catch(err => console.log('Error:', err));
  }

  render() {
    if(this.state.redirect) {
        return (
          <Redirect to='./home'/>
        )
    }
    return(
      <div>
        <Navbar/>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="Page-body">
          <h1>New Course Details</h1>
          <div className="Course-form-body">
            <form onSubmit={ (e) => this.handleCourseAdd(e) }>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <InputLabel htmlFor="uni-select">University</InputLabel>
                <Select name="uni" labelId="uni-select" id="select" onChange={ this.handleUniSelect }>
                  <MenuItem value="UNSW">University of New South Wales</MenuItem>
                  <MenuItem value="USYD">University of Sydney</MenuItem>
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
              <FormControl fullWidth={true} margin='normal'>
                <InputLabel htmlFor="input-description">Learning Outcomes</InputLabel>
                <Input name="learningOutcomes" id="input-description" type="text" multiline={true} rows={2}/>
                <FormHelperText id="my-helper-text">Enter comma-separated text (e.g. Communication, Project Management, Using Software Tools)</FormHelperText>
              </FormControl>
              <FormControl fullWidth={true} required={true} margin='normal'>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={ this.state.allGradOutcomes }
                  getOptionLabel={(option) => option}
                  onChange={this.onTagsChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="gradOutcomes"
                      variant="standard"
                      label="Graduate Outcomes"
                    />
                  )}
                />
              </FormControl>
              <div className="buttons">
                <MuiThemeProvider theme={theme}>
                  <Box m={3}>
                    <Button variant="contained" color="secondary" component={Link} to="./home">
                      Cancel
                    </Button>
                  </Box>
                  <Box m={3}>
                    <Button type="submit" variant="contained" color="primary">
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
