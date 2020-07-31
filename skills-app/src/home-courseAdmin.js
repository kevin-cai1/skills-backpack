import React from 'react';
import './home-courseAdmin.css';
import SessionDetails from './SessionDetails';
import MaterialTable from 'material-table';
import { DeleteIcon, EditIcon, GroupIcon } from '@material-ui/icons';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, DialogContentText, DialogActions, TextField, FormControl } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Autocomplete, Alert} from '@material-ui/lab';
import { theme } from './App.js';
import Navbar from "./Navbar";

class Home_courseAdmin extends React.Component {
  constructor(props) {
      super(props);
      this.state = ({
        columns: [
          { title: 'University', field: 'uni' },
          { title: 'Code', field: 'code' },
          { title: 'Name', field: 'name' },
        ],
        allGradOutcomes: [],
        gradOutcomes: [],
        data: [],
        editModal: false,
        editUni: '',
        editFaculty: '',
        editCode: '',
        editName: '',
        editDescription: '',
        editLink: '',
        editLearnOutcomes: [],
        editGradOutcomes: [],
        successAlert: false,
        failAlert: false,
        deleteAlert: false
      });
      this.handleCourseDelete = this.handleCourseDelete.bind(this);
      this.handleCourseEdit = this.handleCourseEdit.bind(this);
      this.handleEditModalClose = this.handleEditModalClose.bind(this);
  }

  componentDidMount() {
    this.getMyCourses();
  }

  //modal open, close handlers
  handleEditModalClose() {
    this.setState({ editModal: false });
  }
  //end handlers

  //on home page load, get details for all courses created by this course admin
  getMyCourses = () => {
    console.log("getting courses...");
    let component = this;
    let email = SessionDetails.getEmail();
    let url = 'http://localhost:5000/course_admin/' + email;
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
          console.log("items:", items.courses);
          const courses = items.courses;
          const json = [];
          const keys = ["code", "uni", "name"]
          courses.forEach(r => {
            let obj = {};
            r.forEach((r, i) => {
          obj[keys[i]] = r;
            });
            json.push(obj);
          });
          component.setState({ data:json });
          console.log("data looks like: ", component.state.data);
    })
        .catch(err => console.log('Error:', err));
  }

  //intermediate handler required to check correct values of row.uni and row.code
  handleCourseDelete = (e, row) => {
      this.sendCourseDelete(row.uni, row.code);
  }

  //delete a course (handled by API)
  sendCourseDelete(uni, code){
    let component = this;
    let data = JSON.stringify({
        "code": code,
        "university": uni
    });
    let url = 'http://localhost:5000/course/add/delete';
    console.log('Sending to ' + url + ': ' + data);

    return fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: data
    }).then(response => {
        console.log('response ' + response);
        console.log('response stat HELLO?? ' + response.status);
        component.getMyCourses();
        component.setState({ deleteAlert: true })
        return response.ok && response.json();
    })
        .catch(err => console.log('Error:', err));
  }

  //intermediate handler required to check correct values of row.uni and row.code
  handleCourseEdit = (e, row) => {
      console.log("in edit: ", row.code);
      this.setCourseDetails(row.code, row.uni);
  }

  //get all details for a selected course and display them in a modal
  setCourseDetails(code, uni) {
    this.getGradOutcomes(uni);
    let component = this;
    let url = 'http://localhost:5000/course/add/' + uni + '/' + code;
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
          console.log("items:", items);
          component.setState({ editUni: items.general_course_info[0][1] });
          component.setState({ editCode: items.general_course_info[0][0] });
          component.setState({ editFaculty: items.general_course_info[0][2] });
          component.setState({ editDescription: items.general_course_info[0][3] });
          component.setState({ editName: items.general_course_info[0][4] });
          component.setState({ editLink: items.general_course_info[0][5] });
          component.setState({ editLearnOutcomes: items.learnoutcomes });
          component.setState({ editGradOutcomes: items.gradoutcomes });
          component.setState({ editModal: true });
    })
        .catch(err => console.log('Error:', err));
  }

  //get list of all graduate outcomes for a selected uni. to display in graduate outcomes dropdown
  getGradOutcomes = (uni) => {
    const urlUni = this.acronymUniversity(uni);
    let component = this;
    let url = 'http://localhost:5000/course/add/' + urlUni;
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

  //handle when admin edits course details inside modal and clicks submit
  handleCourseEditSubmit = (e) => {
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

  //update backend to edited course details
  handleCourseSend(dict) {
    let component = this;
    let url = 'http://localhost:5000/course/add/edit';
    console.log('Sending to ' + url + ': ' + dict);
    return fetch(url, {
        method: 'PUT',
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
              component.handleEditModalClose();
              component.setState({ successAlert: true });
              component.getMyCourses();
          }
          else{
              component.setState({ failAlert: true });
          }
    })
        .catch(err => console.log('Error:', err));
  }

  acronymUniversity(uni) {
    console.log("hello?");
    if(uni == "University of New South Wales"){
      return("UNSW");
    }
    if(uni == "University of Sydney"){
      return("USYD");
    }
    if(uni == "University of Technology Sydney"){
      return("UTS");
    }
    else{
      return(uni);
    }
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

  render() {
    return(
      <div>
        <Navbar/>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="Manage-course-body">
          <h1>My Courses</h1>
          { this.state.failAlert && <div><Alert severity="error">
            There was an error editing your course.
          </Alert></div>}
          { this.state.successAlert && <div><Alert severity="success">
            Course successfully edited.
          </Alert></div> }
          { this.state.deleteAlert && <div><Alert severity="success">
            Course deleted.
          </Alert></div> }
          <div className="Top-right">
            <MuiThemeProvider theme={theme}>
              <Box m={3}>
                <Button variant="contained" color="primary" component={Link} to="/course_create">
                  Create new course
                </Button>
              </Box>
            </MuiThemeProvider>
          </div>
          <div className="Main-table">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <MaterialTable
              columns={this.state.columns}
              data={this.state.data}
              title="My Courses"
              actions={[
                {
                  icon: 'edit',
                  tooltip: 'Edit Course',
                  onClick: (e, rowData) => this.handleCourseEdit(e, rowData)
                },
                rowData => ({
                  icon: 'delete',
                  tooltip: 'Delete Course',
                  onClick: (e, rowData) => {if(window.confirm('Are you sure you want to delete this course?')){
                    this.handleCourseDelete(e, rowData);
                  }}
                })
              ]}
            />
          </div>
        </body>
        <footer className="Home-footer">
            <p>Yuppies 2020 </p>
        </footer>
        <MuiThemeProvider theme={theme}>
          <Dialog
            aria-labelledby="form-dialog-title"
            open={this.state.editModal}
          >
            <DialogContent>
              <form onSubmit={this.handleCourseEditSubmit}>
                <DialogContentText type="title" id="modal-title">
                  Edit Course Details
                </DialogContentText>
                <TextField
                  disabled
                  defaultValue={this.state.editUni}
                  margin="normal"
                  id="uni"
                  name="uni"
                  label="University"
                  type="text"
                  helperText="Cannot be changed"
                  fullWidth
                />
                <TextField
                  disabled
                  defaultValue={this.state.editCode}
                  margin="normal"
                  id="code"
                  name="code"
                  label="Course Code"
                  type="text"
                  helperText="Cannot be changed"
                  fullWidth
                />
                <TextField
                  disabled
                  defaultValue={this.state.editFaculty}
                  margin="normal"
                  id="faculty"
                  name="faculty"
                  label="Faculty"
                  type="text"
                  helperText="Cannot be changed"
                  fullWidth
                />
                <TextField
                  defaultValue={this.state.editName}
                  margin="normal"
                  id="name"
                  name="name"
                  label="Course Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  defaultValue={this.state.editLink}
                  margin="normal"
                  id="link"
                  name="link"
                  label="Course Link"
                  type="text"
                  helperText="e.g. Handbook link"
                  fullWidth
                />
                <TextField
                  defaultValue={this.state.editDescription}
                  margin="normal"
                  id="description"
                  name="description"
                  label="Course Description"
                  type="text"
                  multiline={true}
                  rows={5}
                  helperText="(Optional) max. 200 words"
                  fullWidth
                />
                <TextField
                  defaultValue={this.state.editLearnOutcomes}
                  margin="normal"
                  id="learningOutcomes"
                  name="learningOutcomes"
                  label="Learning Outcomes"
                  type="text"
                  multiline={true}
                  rows={2}
                  helperText="Enter comma-separated text (e.g. Communication, Project Management, Using Software Tools)"
                  fullWidth
                />
                <FormControl fullWidth={true} required={true} margin='normal'>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={ this.state.allGradOutcomes }
                    defaultValue={ this.state.editGradOutcomes }
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
                <Button onClick={this.handleEditModalClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default Home_courseAdmin
