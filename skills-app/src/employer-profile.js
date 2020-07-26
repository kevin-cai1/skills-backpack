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
import EmailIcon from '@material-ui/icons/Email';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Navbar from "./Navbar";

class Employer_Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search_skills_open: false,
            newSkill: '',
            addSkillSuccess: false,
            addSkillSuccessMessage: '',
            allSkills: '',
            skillID: 0,
            requiredSkills: []
        };
        this.handleSearchSkillsModal = this.handleSearchSkillsModal.bind(this);
        this.handleSearchSkillsModalClose = this.handleSearchSkillsModalClose.bind(this);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleClearStatus = this.handleClearStatus.bind(this);
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
        let url = 'http://localhost:5000/skills/' + SessionDetails.getEmail();
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
                this.state.requiredSkills = response["entries"];
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
                <Navbar/>
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="column-container">
                <div className="center-align-container">
                    <div style={{'display': 'inline-block', 'padding-top':'50px'}}>
                        <div><AccountCircleIcon style={{ fontSize: 100 }}/></div>
                        <div style={{color: 'dimgrey'}}><h2>{SessionDetails.getName()}</h2></div>
                        <div className="row-container">
                            {/*<div className="user-profile-details-row">*/}
                            {/*    <SchoolIcon className="sm-icon-padded"/>*/}
                            {/*    <h5>University of New South Wales</h5>*/}
                            {/*</div>*/}
                            <div className="user-profile-details-row">
                                <EmailIcon className="sm-icon-padded"/>
                                <h5>{SessionDetails.getEmail()}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ep-container">
                    <MuiThemeProvider theme={theme}>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Required Skills</h3>
                            <AddCircleIcon className="add-circle-button" onClick={this.handleSearchSkillsModal}/>
                        </div>
                        <div>
                            {this.state.requiredSkills.map(i => {
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
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Employer_Profile;
