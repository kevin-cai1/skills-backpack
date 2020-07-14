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
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import SearchBox from './search-box';
import {Alert} from "@material-ui/lab";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {Link} from "react-router-dom";
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import SchoolIcon from '@material-ui/icons/School';
import EmailIcon from '@material-ui/icons/Email';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LanguageIcon from '@material-ui/icons/Language';

const chipNames = [
    {name: 'css'},
    {name: 'html'},
    {name: 'reactjs'},
    {name: 'python'},
    {name: 'communication'},
]

class Candidate_EPortfolio extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search_skills_open: false,
            add_employment_open: false,
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
    }

    componentDidMount() {
        this.fetchSkills();
        this.fetchEportfolioDetails();
    }

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
        this.setState({[fieldName]: fieldValue});
        this.componentDidMount();
    }

    handleAddJob() {
        return this.postNewEmployment().then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (status) {
                this.setState({jobAdded: true});
                this.clearEmploymentFields();
            }
        });
    }

    clearEmploymentFields() {
        this.setState({jobTitle: ''});
        this.setState({employerName: ''});
        this.setState({presentDate: false});
        this.setState({startDate: ''});
        this.setState({endDate: ''});
        this.setState({jobDescription: ''});
    }

    postNewEmployment() {
        let data = JSON.stringify({
            "user": SessionDetails.getEmail(),
            "employer": this.state.employerName,
            "job_title": this.state.jobTitle,
            "start_date": this.state.startDate,
            "end_date": (this.state.endDate === 'Present') ? '' : this.state.endDate,
            "description": this.state.jobDescription
        });
        let url = 'http://localhost:5000/employment/add';
        console.log('Sending to ' + url + ': ' + data);

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    handleAddSkill() {
        return this.postNewSkill().then( (response) => {
            console.log(response);
            let result = true;
            this.setState({addSkillSuccessMessage: 'Successfully added \'' + this.state.newSkill + '\'.'});
            this.state.addSkillSuccess = true;
            this.forceUpdate();
            this.componentDidMount();
        });
    }

    postNewSkill() {
        let data = JSON.stringify({
            "id": this.state.skillID,
            "name": this.state.newSkill
        });
        let url = 'http://localhost:5000/skills/' + SessionDetails.getEmail();
        console.log('Sending to ' + url + ': ' + data);

        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    handleDeleteSkill(id, name) {
        return this.deleteSkill(id, name).then( (response) => {
            console.log(response);
            this.componentDidMount();
        });
    }

    deleteSkill(id, name) {
        let data = JSON.stringify({
            "id": id,
            "name": name
        });
        let url = 'http://localhost:5000/skills/' + SessionDetails.getEmail();
        console.log('Sending to ' + url + ': ' + data);

        return fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: data
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    handleClearStatus() {
        this.state.addSkillSuccess = false;
        this.state.newSkill = '';
        this.state.skillID = 0;
        this.forceUpdate();
    }

    getAllSkills() {
        let url = 'http://localhost:5000/skills/all';
        console.log('Fetching data from: ' + url);

        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    fetchSkills(event) {
        return this.getAllSkills().then( (response) => {
            let status = response["ok"];
            let count = response["entry_count"];
            if (status && count > 0) {
                this.state.allSkills = response["entries"];
            }
        });
    }

    getAllDetails() {
        let url = 'http://localhost:5000/ePortfolio/' + SessionDetails.getEmail();
        console.log('Fetching data from: ' + url);

        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => {
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    fetchEportfolioDetails() {
        return this.getAllDetails().then( (response) => {
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
                <body className="column-container">
                <div className="center-align-container">
                    <div style={{'display': 'inline-block', 'padding-top':'50px'}}>
                        <div><InsertPhotoIcon style={{ fontSize: 100 }}/></div>
                        <div style={{color: 'dimgrey', "margin":"15px 0px 15px 0px"}}><h2>{this.state.profile.name}</h2></div>
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
                            <AddCircleIcon className="add-circle-button"/>
                        </div>
                        <div>
                            {this.state.candidateCourses.map(i => {
                                return (
                                <div style={{marginBottom:'15px'}}>
                                    <Card style={{maxWidth:'750px'}}>
                                        <CardContent>
                                            <h4 style={{margin:'10px 0px 10px 0px'}}>{i.name} | {i.code}</h4>
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
                                        <CardActions>
                                            <Button size="small">Edit</Button>
                                        </CardActions>
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
                                                <h4 style={{margin:'10px 0px 10px 0px'}}>{i.job_title}</h4>
                                                <p className="ep-course-heading italicised">{i.employer}</p>
                                                <p className="ep-course-heading">{i.start_date} - {i.end_date}</p>
                                                <p>{i.description}</p>
                                            </CardContent>
                                            <CardActions>
                                                <Button size="small">Edit</Button>
                                            </CardActions>
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
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Candidate_EPortfolio;
