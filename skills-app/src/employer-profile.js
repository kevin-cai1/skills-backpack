import React from 'react';
import SessionDetails from "./SessionDetails";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    MuiThemeProvider,
    TextField,
    Chip,
    Card, CardContent, Divider
} from "@material-ui/core";
import {theme} from "./App";
import Button from "@material-ui/core/Button";
import SearchBox from './search-box';
import {Alert} from "@material-ui/lab";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import EmailIcon from '@material-ui/icons/Email';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

class Employer_Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search_skills_open: false,
            search_outcomes_open: false,
            newSkill: '',
            addSkillSuccess: false,
            addSkillFail: false,
            addSkillFailMessage: '',
            addSkillSuccessMessage: '',
            allSkills: '',
            skillID: 0,
            newOutcome: '',
            addOutcomeSuccess: false,
            addOutcomeSuccessMessage: '',
            addOutcomeFail: false,
            addOutcomeFailMessage: '',
            allOutcomes: [],
            requiredSkills: [],
            requiredOutcomes: [],
            candidateList: [],
            numResults: '',
            searchMessage: ''
        };
        this.handleSearchSkillsModal = this.handleSearchSkillsModal.bind(this);
        this.handleSearchSkillsModalClose = this.handleSearchSkillsModalClose.bind(this);
        this.handleSearchOutcomesModal = this.handleSearchOutcomesModal.bind(this);
        this.handleSearchOutcomesModalClose = this.handleSearchOutcomesModalClose.bind(this);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleAddOutcome = this.handleAddOutcome.bind(this);
        this.handleClearStatus = this.handleClearStatus.bind(this);
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
        this.handleDeleteOutcome = this.handleDeleteOutcome.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.fetchSkills();
        this.fetchOutcomes();
        this.fetchEmployerDetails();
    }

    handleSearchSkillsModal() {
        this.setState({search_skills_open: true});
    }

    handleSearchSkillsModalClose() {
        this.setState({search_skills_open: false});
        this.handleClearStatus();
    }

    handleSearchOutcomesModal() {
        this.setState({
            newOutcome: '',
            addOutcomeSuccess: false,
            addOutcomeSuccessMessage: '',
            addOutcomeFail: false,
            addOutcomeFailMessage: '',
        });
        this.setState({search_outcomes_open: true});
    }

    handleSearchOutcomesModalClose() {
        this.setState({search_outcomes_open: false});
    }

    handleChange = (event, values) => {
        const fieldValue = (typeof event.target.name == 'undefined') ? values : event.target.value;
        this.setState({ ['newOutcome']: fieldValue });
    }

    handleAddOutcome() {
        let data = JSON.stringify({
            "GradOutcomes": [this.state.newOutcome],
        });
        let path = 'employer/' + SessionDetails.getEmail();
        console.log("outcome: " + this.state.newOutcome);
        return apiHandler(path, 'POST', data).then( (response) => {
            let status = response["ok"];
            if (status) {
                this.setState({addOutcomeSuccessMessage: 'Successfully added \'' + this.state.newOutcome + '\'.'});
                this.state.addOutcomeSuccess = true;
                this.state.addOutcomeFail = false;
                this.forceUpdate();
                this.componentDidMount();
            }
            else {
                this.setState({addOutcomeFailMessage: '\'' + this.state.newOutcome + '\' already exists.'});
                this.state.addOutcomeSuccess = false;
                this.state.addOutcomeFail = true;
                this.forceUpdate();
            }
        });
    }

    handleAddSkill() {
        let data = JSON.stringify({
            "id": this.state.skillID,
            "name": this.state.newSkill
        });
        let path = 'skills/' + SessionDetails.getEmail();
        return apiHandler(path, 'POST', data).then( (response) => {
            this.setState({addSkillSuccessMessage: 'Successfully added \'' + this.state.newSkill + '\'.'});
            this.state.addSkillSuccess = true;
            this.forceUpdate();
            this.componentDidMount();
        });
    }

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

    handleDeleteOutcome(name) {
        let path = 'employer/criteria/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "GradOutcome": name
        });
        return apiHandler(path, 'DELETE', data).then( (response) => {
            console.log(response);
            this.componentDidMount();
        });
    }

    handleClearStatus() {
        this.state.addSkillSuccess = false;
        this.state.newSkill = '';
        this.state.skillID = 0;
        this.forceUpdate();
    }

    fetchOutcomes(event) {
        return apiHandler('employer/all', 'GET').then( (response) => {
            let status = response["ok"];
            if (status) {
                this.state.allOutcomes = response["gradoutcomes"];
            }
        });
    }

    fetchSkills(event) {
        return apiHandler('skills/all', 'GET').then( (response) => {
            let status = response["ok"];
            let count = response["entry_count"];
            if (status && count > 0) {
                this.state.allSkills = response["entries"];
            }
        });
    }

    fetchEmployerDetails() {
        let path = 'employer/' + SessionDetails.getEmail();
        return apiHandler(path, 'GET').then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (status) {
                this.state.requiredSkills = response["job_skills"];
                this.state.requiredOutcomes = response["employability_skills"];
                this.handleSearch();
                this.forceUpdate();
            }
        });
    }

    postOutcomes() {
        var valueList = [];
        for (var value in this.state.requiredSkills) {
            console.log("name: ", this.state.requiredSkills[value].name);
            valueList.push(this.state.requiredSkills[value].name);
        }
        let data = JSON.stringify({
            "attributes": valueList
        });
        let url = 'http://localhost:5000/search/search';
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

    //get all candidates who match current criteria on the employer's profile and display
    handleSearch() {
        this.state.candidateList = [];
        return this.postOutcomes().then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                console.log("No results found.");
                this.setState({
                    candidateList: [],
                    searchMessage: "0 candidate matches for current criteria."
                });
            } else {
                let candidateList = response["candidates"];
                candidateList.map( i => {
                    i["matching skills"] = JSON.stringify(i["matching skills"]);
                    i["matching skills"] = i["matching skills"].replace(/\"/g, '');
                    i["matching skills"] = i["matching skills"].replace(/\[/g, '');
                    i["matching skills"] = i["matching skills"].replace(/\]/g, '');
                    i["matching skills"] = i["matching skills"].replace(/\,/g, '\, ');
                });
                this.setState({
                    candidateList: candidateList,
                    numResults: candidateList.length,
                    searchMessage: candidateList.length + " result(s) for current criteria."
                });
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
                        <div className="row-container">
                            <h3 className="ep-h3-text">Required Graduate Outcomes</h3>
                            <AddCircleIcon className="add-circle-button" onClick={this.handleSearchOutcomesModal}/>
                        </div>
                        <div>
                            {this.state.requiredOutcomes.map(i => {
                                return <Chip label={i.name} id={i.id} className="skills-chip"
                                             onDelete={() => this.handleDeleteOutcome(i.name)}
                                />
                            })}
                        </div>
                        <Divider variant="middle" style={{margin:'40px 0px 23px 0px'}}/>
                        <div className="col-container">
                            <h3 className="ep-h3-text">Matching Candidates</h3>
                            <div style={{'display':'inline-block'}}>
                                <div style={{'overflow':'hidden'}}>
                                    <p className="ep-course-heading italicised" style={{float:'left','font-style':'normal','marginBottom':'10px'}}>
                                        {this.state.searchMessage}
                                    </p>
                                </div>
                                {this.state.candidateList.map(i => {
                                    return (
                                        <div style={{marginBottom:'15px'}}>
                                            <Card style={{width:'750px'}}>
                                                <CardContent>
                                                    <div style={{'overflow':'hidden'}}>
                                                        <h4 style={{margin:'10px 0px 10px 0px',float:'left','text-decoration':'none'}}>
                                                            <a href={'./view-eportfolio/' + i.email} target="_blank" style={{'text-decoration':'none', color:'#2D9CDB'}}>
                                                                {i.name}
                                                            </a>
                                                        </h4>
                                                    </div>
                                                    <div style={{'overflow':'hidden'}}>
                                                        <p className="ep-course-heading italicised" style={{float:'left','font-style':'normal'}}>{i.degree} Student</p>
                                                    </div>
                                                    <div className="row-container">
                                                        <div className="row-container">
                                                            <EmailIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
                                                            <p className="ep-course-heading">{i.email}</p>
                                                        </div>
                                                    </div>
                                                    <div style={{'overflow':'hidden'}}>
                                                        <p className="ep-course-heading italicised" style={{float:'left', 'margin-top':'15px'}}>
                                                            Skills: {i["matching skills"]}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
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
                        open={this.state.search_outcomes_open}
                        onClose={this.handleSearchOutcomesModalClose}
                    >
                        <DialogContent>
                            <DialogContentText type="title" id="modal-title">
                                Add Graduate Outcome
                            </DialogContentText>
                            { (this.state.addOutcomeSuccess) &&
                            <Alert className="Login-alert" severity="success" style={{"marginBottom":"8px"}}>
                                {this.state.addOutcomeSuccessMessage}
                            </Alert>
                            }
                            { (this.state.addOutcomeFail) &&
                            <Alert className="Login-alert" severity="error" style={{"marginBottom":"8px"}}>
                                {this.state.addOutcomeFailMessage}
                            </Alert>
                            }
                            <Autocomplete
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                onChange={this.handleChange}
                                options={this.state.allOutcomes.map((option) => option)}
                                style={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search.."
                                        margin="normal"
                                        onChange={this.handleChange}
                                        InputProps={{ ...params.InputProps, type: 'search' }}
                                    />
                                )}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleSearchOutcomesModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary" onClick={this.handleAddOutcome}>
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
