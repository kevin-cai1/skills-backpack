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
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Navbar from "./Navbar";

class View_Employer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            skillID: 0,
            requiredSkills: [],
            employerDetails:[],
        };
    }

    componentDidMount() {
        this.populateDetails();
    }


    getSkills(email) {
        let url = 'http://localhost:5000/skills/' + email;
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

    fetchSkills(email) {
        return this.getSkills(email).then( (response) => {
            console.log(response);
            let status = response["ok"];
            let count = response["entry_count"];
            if (status) {
                this.state.requiredSkills = response["entries"];
                this.forceUpdate();
            }
        });
    }

    populateDetails() {
        return this.getDetails().then( (response) => {
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
                this.fetchSkills(email);
            }
        });
    }

    getDetails() {
        let data = JSON.stringify({
            "employer_name": this.props.match.params.user
        });
        let url = 'http://localhost:5000/search/searchemployers';
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
                            <h3 className="ep-h3-text">Required Skills</h3>
                        </div>
                        <div>
                            {this.state.requiredSkills.map(i => {
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
