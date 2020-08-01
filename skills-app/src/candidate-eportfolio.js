import React from 'react';
import SessionDetails from "./SessionDetails";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText, FormControl, FormHelperText, Input,
    InputLabel, MenuItem,
    MuiThemeProvider, Select,
    TextField,
    Chip,
    Card, CardContent, Typography, CardActions
} from "@material-ui/core";
import {theme} from "./App";
import Button from "@material-ui/core/Button";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import SearchBox from './search-box';
import {Alert} from "@material-ui/lab";
import SchoolIcon from '@material-ui/icons/School';
import EmailIcon from '@material-ui/icons/Email';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LanguageIcon from '@material-ui/icons/Language';
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// component to display candidate's E-Portfolio
class Candidate_EPortfolio extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search_skills_open: false,
            add_employment_open: false,
            edit_account_open: false,
            newSkill: '',
            addSkillSuccess: false,
            addSkillSuccessMessage: '',
            allSkills: '',
            skillID: 0,
            presentDate: false,
            jobTitle: '',
            employerName: '',
            startDate: '',
            endDate: '',
            jobDescription: '',
            jobAdded: false,
            candidateJobSkills: [],
            candidateEmpSkills: [],
            candidateCourses: [],
            candidateEmpHistory: [],
            profile: [],
            userName: '',
            userUni: '',
            userDegree: '',
            userGradYear: '',
            accountUpdated: false,
            add_course_open: false,
            addedUni: '',
            all_course_codes: [],
            all_course_names: [],
            courseAddSuccess: false
        };
        this.handleSearchSkillsModal = this.handleSearchSkillsModal.bind(this);
        this.handleSearchSkillsModalClose = this.handleSearchSkillsModalClose.bind(this);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleClearStatus = this.handleClearStatus.bind(this);
        this.handleAddEmploymentModal = this.handleAddEmploymentModal.bind(this);
        this.handleAddEmploymentModalClose = this.handleAddEmploymentModalClose.bind(this);
        this.handleEmploymentCheckbox = this.handleEmploymentCheckbox.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddJob = this.handleAddJob.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
        this.handleEditAccountModal = this.handleEditAccountModal.bind(this);
        this.handleEditAccountModalClose = this.handleEditAccountModalClose.bind(this);
        this.handleEditAccount = this.handleEditAccount.bind(this);
        this.handleDeleteEmployment = this.handleDeleteEmployment.bind(this);
        this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
        this.handleAddCourseModal = this.handleAddCourseModal.bind(this);
        this.handleAddCourseModalClose = this.handleAddCourseCloseModal.bind(this);
        this.handleUniSelect = this.handleUniSelect.bind(this);
        this.handleAddCourse = this.handleAddCourse.bind(this);
        this.createCoursesForSelect = this.createCoursesForSelect.bind(this);
    }

    componentDidMount() {
        this.fetchSkills();
        this.fetchEportfolioDetails();
    }

    //handlers for modal opens and closes
    handleSearchSkillsModal() {
        this.setState({search_skills_open: true});
    }

    handleSearchSkillsModalClose() {
        this.setState({search_skills_open: false});
        this.handleClearStatus();
    }

    handleAddEmploymentModal() {
        this.setState({add_employment_open: true});
    }

    handleAddEmploymentModalClose() {
        this.setState({add_employment_open: false});
        this.clearEmploymentFields();
        this.setState({jobAdded: false});
    }

    handleAddCourseModal() {
        this.setState({add_course_open: true});
    }

    handleAddCourseCloseModal() {
        this.setState({add_course_open: false});
    }

    handleEmploymentCheckbox() {
        if (this.state.presentDate) {
            this.setState({presentDate: false});
            this.setState({endDate: ''});
        }
        else {
            this.setState({presentDate: true});
            this.setState({endDate: 'Present'});
        }
    }

    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        console.log('fn: ' + fieldName + ', fv: ' + fieldValue);
        this.setState({[fieldName]: fieldValue});
        this.componentDidMount();
    }

    handleEditAccountModal() {
        this.state.userName = this.state.profile.name;
        this.state.userUni = this.state.profile.university;
        this.state.userDegree = this.state.profile.degree;
        this.state.userGradYear = this.state.profile.gradYear;
        this.state.accountUpdated = false;
        this.setState({edit_account_open: true});
    }

    handleEditAccountModalClose() {
        this.setState({edit_account_open: false});
    }
    //end modal handlers

    // method for editing account details
    handleEditAccount() {
        let url = 'candidate/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "email": SessionDetails.getEmail(),
            "name": this.state.userName,
            "university": this.state.userUni,
            "degree": this.state.userDegree,
            "gradYear": this.state.userGradYear
        });
        return apiHandler(url, 'PUT', data).then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (status) {
                this.setState({accountUpdated: true});
                SessionDetails.setName(this.state.userName);
            }
            this.componentDidMount();
        });
    }

    // method for handling adding a job and rendering it
    handleAddJob() {
        let data = JSON.stringify({
            "user": SessionDetails.getEmail(),
            "employer": this.state.employerName,
            "job_title": this.state.jobTitle,
            "start_date": this.state.startDate,
            "end_date": (this.state.endDate === 'Present') ? '' : this.state.endDate,
            "description": this.state.jobDescription
        });
        return apiHandler('employment/add', 'POST', data).then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (status) {
                this.setState({jobAdded: true});
                this.clearEmploymentFields();
                this.componentDidMount();
            }
        });
    }

    // method for clearing employment modal fields
    clearEmploymentFields() {
        this.setState({jobTitle: ''});
        this.setState({employerName: ''});
        this.setState({presentDate: false});
        this.setState({startDate: ''});
        this.setState({endDate: ''});
        this.setState({jobDescription: ''});
    }

    // method for handling adding skills
    handleAddSkill() {
        let url = 'skills/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "id": this.state.skillID,
            "name": this.state.newSkill
        });
        return apiHandler(url, 'POST', data).then( (response) => {
            console.log(response);
            let result = true;
            this.setState({addSkillSuccessMessage: 'Successfully added \'' + this.state.newSkill + '\'.'});
            this.state.addSkillSuccess = true;
            this.forceUpdate();
            this.componentDidMount();
        });
    }

    // method for handling deleting a skill
    handleDeleteSkill(id, name) {
        let path = 'skills/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "id": id,
            "name": name
        });
        return apiHandler(path, 'DELETE', data).then( (response) => {
            console.log(response);
            this.componentDidMount();
        });
    }

    handleDeleteCourse(uni, code) {
        let path = 'ePortfolio/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "code": code,
            "university": uni
        });
        return apiHandler(path, 'DELETE', data).then( (response) => {
            this.componentDidMount();
            this.forceUpdate();
        });
    }

    // method for handling the deletion of employment history
    handleDeleteEmployment(id) {
        let path = 'employment/' + id;
        return apiHandler(path, 'DELETE').then( (response) => {
            this.componentDidMount();
            this.forceUpdate();
        });
    }

    // method for clearing skill modal input
    handleClearStatus() {
        this.state.addSkillSuccess = false;
        this.state.newSkill = '';
        this.state.skillID = 0;
        this.forceUpdate();
    }

    // method for getting list of skills and populating the add skills dropdown
    fetchSkills(event) {
        return apiHandler('skills/all', 'GET').then( (response) => {
            let status = response["ok"];
            let count = response["entry_count"];
            if (status && count > 0) {
                this.state.allSkills = response["entries"];
            }
        });
    }

    // method for getting all the user's E-Portfolio details
    fetchEportfolioDetails() {
        let path = 'ePortfolio/' + SessionDetails.getEmail();
        return apiHandler(path, 'GET').then( (response) => {
            console.log(response);
            let status = response["ok"];
            let count = response["entry_count"];
            if (status) {
                this.state.candidateJobSkills = response["job_skills"];
                this.state.candidateEmpSkills = response["employability_skills"];
                this.state.candidateCourses = response["courses"];
                this.state.candidateEmpHistory = response["employment"];
                this.state.profile = response["profile"];
                this.forceUpdate();
            }
        });
    }

    //display all courses for a selected uni. for candidate to add to EP
    handleUniSelect = (e) => {
      this.setState({addedUni: e.target.value});
      this.setState({all_course_codes: []});
      this.setState({all_course_names: []});
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
            const items = data.courselist;
            var item;
            for(item in items){
              const code = items[item].code;
              const name = items[item].name;
              console.log("code: ", code);
              console.log("name: ", name);
              component.setState({
                all_course_codes: [
                  ...component.state.all_course_codes, code
                ]
              })
              component.setState({
                all_course_names: [
                  ...component.state.all_course_names, name
                ]
              })
            }
      })
          .catch(err => console.log('Error:', err));
    }

    //create dropdown options for each course from above^
    createCoursesForSelect() {
        const items = [];
        const codes = this.state.all_course_codes;
        const names = this.state.all_course_names;
        var i;
        codes.forEach((code, index) => {
          const name = names[index];
          items.push(<MenuItem value={code}>{code} - {name}</MenuItem>);
        });

        return items;
    }

    //add selected course to EP
    handleAddCourse(e) {
        let path = 'ePortfolio/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "code": e.target.course.value,
            "university": this.state.addedUni
        });
        return apiHandler(path, 'POST', data).then( (response) => {
            this.handleAddCourseCloseModal();
            this.componentDidMount();
            this.forceUpdate();
        });
    }

    // callback function to get input value from child searchbox component
    callbackFunction = (childData) => {
        if (! (childData == null)) {
            if (childData.hasOwnProperty('inputValue')) {
                this.setState({newSkill: childData.inputValue});
                this.setState({skillID: -1});
            }
            else {
                this.setState({newSkill: childData.name});
                this.setState({skillID: childData.id});
            }
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="column-container">
                <div className="center-align-container">
                    <div style={{'display': 'inline-block', 'padding-top':'50px'}}>
                        <div><AccountCircleIcon style={{ fontSize: 100 }}/></div>
                        <div style={{color: 'dimgrey', "margin":"15px 0px 15px 0px", "padding-left":"20px"}}>
                            <h2>
                                {this.state.profile.name}&nbsp;&nbsp;&nbsp;
                                <div style={{'display':'inline-block'}}>
                                    <EditIcon style={{ fontSize: 25, 'cursor': 'pointer', 'color':'#2D9CDB'}} onClick={this.handleEditAccountModal}/>
                                </div>
                            </h2>
                        </div>
                        <h5 style={{"margin":"5px 0px 5px 0px"}}>{this.state.profile.degree} &middot; {this.state.profile.gradYear} Graduate</h5>
                        <div className="row-container">
                            <div className="user-profile-details-row">
                                <SchoolIcon className="sm-icon-padded"/>
                                <h5>{this.state.profile.university}</h5>
                            </div>
                            <div className="user-profile-details-row">
                                <EmailIcon className="sm-icon-padded"/>
                                <h5>{this.state.profile.email}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ep-container">
                    <MuiThemeProvider theme={theme}>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Completed Courses</h3>
                            <AddCircleIcon className="add-circle-button" onClick={this.handleAddCourseModal}/>
                        </div>
                        <div>
                            {this.state.candidateCourses.map(i => {
                                return (
                                <div style={{marginBottom:'15px'}}>
                                    <Card style={{maxWidth:'750px'}}>
                                        <CardContent>
                                            <div className="row-container" style={{'justify-content':'space-between'}}>
                                                <h4 style={{margin:'10px 0px 10px 0px'}}>{i.name} | {i.code}</h4>
                                                <div>
                                                    <DeleteIcon
                                                        style={{'cursor':'pointer','color':'#ad4e3d'}}
                                                        onClick={() => {if(window.confirm('Are you sure you want to delete?')){
                                                          this.handleDeleteCourse(i.university, i.code);
                                                        }}}
                                                      />
                                                </div>
                                            </div>
                                            <p className="ep-course-heading italicised">{i.faculty} Faculty &middot; {i.university}</p>
                                            <div className="row-container">
                                                <div className="row-container" style={{marginRight:'20px'}}>
                                                    <LanguageIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
                                                    <p className="ep-course-heading">{i.link}</p>
                                                </div>
                                                <div className="row-container">
                                                    <EmailIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
                                                    <p className="ep-course-heading">{i.course_email}</p>
                                                </div>
                                            </div>
                                            <p>{i.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                )
                            })}
                        </div>
                        <h3 className="ep-h3-text">Employability Skills</h3>
                        <div>
                            {this.state.candidateEmpSkills.map(i => {
                                return <Chip label={i.grad_outcome} className="skills-chip"/>
                            })}
                        </div>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Work Experience</h3>
                            <AddCircleIcon className="add-circle-button" onClick={this.handleAddEmploymentModal}/>
                        </div>
                        <div>
                            {this.state.candidateEmpHistory.map(i => {
                                return (
                                    <div style={{marginBottom:'15px'}}>
                                        <Card style={{maxWidth:'750px'}}>
                                            <CardContent>
                                                <div className="row-container" style={{'justify-content':'space-between'}}>
                                                    <h4 style={{margin:'10px 0px 10px 0px'}}>{i.job_title}</h4>
                                                    <div>
                                                        <div>
                                                            <DeleteIcon
                                                                style={{'cursor':'pointer','color':'#ad4e3d'}}
                                                                onClick={() => {if(window.confirm('Are you sure you want to delete?')){
                                                                  this.handleDeleteEmployment(i.id);
                                                                }}}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="ep-course-heading italicised">{i.employer}</p>
                                                <p className="ep-course-heading">{i.start_date} - {i.end_date || 'Present'}</p>
                                                <p>{i.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Job-Specific Skills</h3>
                            <AddCircleIcon className="add-circle-button" onClick={this.handleSearchSkillsModal}/>
                        </div>
                        <div>
                            {this.state.candidateJobSkills.map(i => {
                                return <Chip label={i.name} id={i.id} className="skills-chip"
                                             onDelete={() => this.handleDeleteSkill(i.id, i.name)}/>
                            })}
                        </div>
                    </MuiThemeProvider>
                </div>
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.search_skills_open}
                        onClose={this.handleSearchSkillsModalClose}
                    >
                        <DialogContent>
                            <DialogContentText type="title" id="modal-title">
                                Add Skill
                            </DialogContentText>
                            { (this.state.addSkillSuccess) &&
                            <Alert className="Login-alert" severity="success" style={{"marginBottom":"8px"}}>
                                {this.state.addSkillSuccessMessage}
                            </Alert>

                            }
                            <SearchBox
                                data={this.state.allSkills}
                                id="skillName"
                                parentCallback = {this.callbackFunction}
                                onClick={this.handleClearStatus}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleSearchSkillsModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" onClick={this.handleAddSkill}>
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.add_employment_open}
                        onClose={this.handleAddEmploymentModalClose}
                    >
                        <DialogContent style={{"minWidth": "300px"}}>
                            <DialogContentText type="title" id="modal-title">
                                Add Employment
                            </DialogContentText>
                            {
                                (this.state.jobAdded) &&
                                <Alert className="Login-alert" severity="success">Successfully added new job.</Alert>
                            }
                            <div className="Course-form-body">
                                <form style={{"minWidth": "300px"}}>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField required label="Role"
                                                   name="jobTitle"
                                                   onChange={this.handleChange}
                                                   value={this.state.jobTitle}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField required label="Employer"
                                                   name="employerName"
                                                   onChange={this.handleChange}
                                                   value={this.state.employerName}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <FormControlLabel
                                            control={
                                                <Checkbox color="primary"
                                                      onClick={this.handleEmploymentCheckbox}
                                                      checked={this.state.presentDate}
                                                />
                                            }
                                            label="I currently work here"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <InputLabel htmlFor="start-date" shrink={true}>Start Date</InputLabel>
                                        <Input name="startDate" type="date" id="input-start-date" aria-describedby="my-helper-text"
                                               onChange={this.handleChange}
                                               value={this.state.startDate}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <InputLabel htmlFor="end-date" shrink={true}>End Date</InputLabel>
                                        <Input
                                            name="endDate"
                                            type={this.state.presentDate ? "text" : "date"}
                                            id="input-end-date"
                                            aria-describedby="my-helper-text"
                                            value={this.state.endDate}
                                            onChange={this.handleChange}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField
                                            name="jobDescription"
                                            label="Description"
                                            multiline
                                            rowsMax={3}
                                            onChange={this.handleChange}
                                            value={this.state.jobDescription}
                                        />
                                    </FormControl>
                                </form>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleAddEmploymentModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" onClick={this.handleAddJob}>
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.edit_account_open}
                        onClose={this.handleEditAccountModalClose}
                    >
                        <DialogContent style={{"minWidth": "300px"}}>
                            <DialogContentText type="title" id="modal-title">
                                Edit Account Details
                            </DialogContentText>
                            {
                                (this.state.accountUpdated) &&
                                <Alert className="Login-alert" severity="success">Account has been updated.</Alert>
                            }
                            <div className="Course-form-body">
                                <form style={{"minWidth": "300px"}}>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField required label="Name"
                                                   name="userName"
                                                   onChange={this.handleChange}
                                                   defaultValue={this.state.profile.name}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <InputLabel htmlFor="uni-select">University</InputLabel>
                                        <Select name="userUni" labelId="uni-select"
                                                id="select" onChange={ this.handleChange }
                                                defaultValue={this.state.profile.university}
                                        >
                                            <MenuItem value="UNSW">University of New South Wales</MenuItem>
                                            <MenuItem value="USYD">University of Sydney</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField required label="Degree"
                                                   name="userDegree"
                                                   onChange={this.handleChange}
                                                   defaultValue={this.state.profile.degree}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true} required={true} margin='normal'>
                                        <TextField required label="Graduation Year"
                                                   name="userGradYear"
                                                   onChange={this.handleChange}
                                                   defaultValue={this.state.profile.gradYear}
                                        />
                                    </FormControl>
                                </form>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleEditAccountModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" onClick={this.handleEditAccount}>
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.add_course_open}
                        onClose={this.handleAddCourseModalClose}
                    >
                        <form onSubmit={this.handleAddCourse}>
                            <DialogContent style={{"minWidth": "300px"}}>
                                <DialogContentText type="title" id="modal-title">
                                    Add Course
                                </DialogContentText>
                                <FormControl fullWidth={true} required={true} margin='normal'>
                                    <InputLabel htmlFor="uni-select">University</InputLabel>
                                    <Select name="uni" labelId="uni-select"
                                            id="select" onChange={ this.handleUniSelect }
                                    >
                                        <MenuItem value="UNSW">University of New South Wales</MenuItem>
                                        <MenuItem value="USYD">University of Sydney</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth={true} required={true} margin='normal'>
                                    <InputLabel htmlFor="course-select">Course</InputLabel>
                                    <Select name="course" labelId="course-select"
                                            id="select"
                                    >
                                        { this.createCoursesForSelect() }
                                    </Select>
                                </FormControl>
                            </DialogContent>
                            <Button onClick={this.handleAddCourseModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" type="submit">
                                Add
                            </Button>
                        </form>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Candidate_EPortfolio;
