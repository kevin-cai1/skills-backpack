import React from 'react';
import {
    MuiThemeProvider, Chip, Card, CardContent
} from "@material-ui/core";
import {theme} from "./App";
import SchoolIcon from '@material-ui/icons/School';
import EmailIcon from '@material-ui/icons/Email';import LanguageIcon from '@material-ui/icons/Language';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// method to display student E-Portfolio
class View_EPortfolio extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            candidateJobSkills: [],
            candidateEmpSkills: [],
            candidateCourses: [],
            candidateEmpHistory: [],
            profile: [],
        };
    }

    componentDidMount() {
        this.fetchEportfolioDetails();
    }

    // method to get E-Portfolio Details from backend API
    fetchEportfolioDetails() {
        let path = 'ePortfolio/' + this.props.match.params.user;
        return apiHandler(path, 'GET').then( (response) => {
            let status = response["ok"];
            let count = response["entry_count"];
            // set all states so it can be rendered on the page
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
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="row-container">
                            <h3 className="ep-h3-text">Job-Specific Skills</h3>
                        </div>
                        <div>
                            {this.state.candidateJobSkills.map(i => {
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

export default View_EPortfolio;
