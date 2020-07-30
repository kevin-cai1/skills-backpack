import React from 'react';
import {
    MuiThemeProvider, Chip,
} from "@material-ui/core";
import {theme} from "./App";
import EmailIcon from '@material-ui/icons/Email';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// component to display employer profile to candidates
class View_Employer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            skillID: 0,
            requiredSkills: [],
            requiredOutcomes: [],
            employerDetails:[],
        };
    }

    componentDidMount() {
        this.populateDetails();
    }

    // get job skills and graduate outcomes from backend
    fetchSkillsOutcomes(email) {
        let path = 'employer/' + email;
        return apiHandler(path, 'GET').then( (response) => {
            let status = response["ok"];
            if (status) {
                this.state.requiredSkills = response["job_skills"];
                this.state.requiredOutcomes = response["employability_skills"];
                this.forceUpdate();
            }
        });
    }

    // get employer profile details from backend api and display on page
    populateDetails() {
        let data = JSON.stringify({
            "employer_name": this.props.match.params.user
        });
        return apiHandler('search/searchemployers', 'POST', data).then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                console.log("error");
            } else {
                let details = response["employer_details"];
                this.setState({
                    employerDetails: details
                });
                let email = details["email"];
                this.fetchSkillsOutcomes(email);
            }
        });
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
                        <div style={{color: 'dimgrey'}}><h2>{this.state.employerDetails.company}</h2></div>
                        <div className="row-container">
                            <div className="user-profile-details-row">
                                <PersonOutlineIcon className="sm-icon-padded"/>
                                <h5>{this.state.employerDetails.name}</h5>
                            </div>
                            <div className="user-profile-details-row">
                                <EmailIcon className="sm-icon-padded"/>
                                <h5>{this.state.employerDetails.email}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ep-container">
                    <MuiThemeProvider theme={theme}>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Required Job Skills</h3>
                        </div>
                        <div>
                            {this.state.requiredSkills.map(i => {
                                return <Chip label={i.name} id={i.id} className="skills-chip"/>
                            })}
                        </div>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Required Employability Skills</h3>
                        </div>
                        <div>
                            {this.state.requiredOutcomes.map(i => {
                                return <Chip label={i.name} id={i.id} className="skills-chip"/>
                            })}
                        </div>
                    </MuiThemeProvider>
                </div>
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        );
    }
}

export default View_Employer;
