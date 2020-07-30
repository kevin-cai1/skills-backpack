import React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import {Button, ButtonGroup, Card, CardContent} from '@material-ui/core';
import { theme } from './App.js'
import EmailIcon from '@material-ui/icons/Email';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// component for the employer/company search page
class SearchEmployer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allEmployers: [], // array to store list of all employers
            employerName: '', // selected employer
            employerDetails: [], // array to store selected employer details
            searchMessage: '', // message if employer searched doesn't exist
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.populateDropdown();
    }

    // method to fetch employer list from API to populate the dropdown menu
    populateDropdown() {
        return apiHandler('search/searchemployers', 'GET').then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                console.log("error");
            } else {
                let outcomes = response["employers"];
                this.setState({
                    allEmployers: outcomes
                });
            }
        });
    }

    // method to post search results to API, and display response
    handleSearch() {
        let data = JSON.stringify({
            "employer_name": this.state.employerName
        });
        return apiHandler('search/searchemployers', 'POST', data).then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                this.setState({
                    searchMessage: 'No results for ' + this.state.employerName + '. Try selecting a valid company from the dropdown.',
                    employerDetails: []
                    });
            } else {
                let details = response["employer_details"];
                this.setState({
                    employerDetails: [],
                    searchMessage: ''
                });
                this.setState({
                    employerDetails: this.state.employerDetails.concat(details)
                });
            }
        });
    }

    // method to handle changes in searchbar user input and save the search value to state
    handleChange = (event, values) => {
        const fieldValue = (typeof event.target.name == 'undefined') ? values : event.target.value;
        this.setState({ ['employerName']: fieldValue });
        console.log('fieldName: employerName, fieldValue: ' + fieldValue);
    }

    render () {
        return (
            <div className="A-page">
                <Navbar/>
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="column-container">
                <div className="center-align-container">
                    <div className="search-inline">
                        <h3>Company Search</h3>
                        <div className="row-container">
                            <div style={{ width: 300 }}>
                                <Autocomplete
                                    freeSolo
                                    id="free-solo-2-demo"
                                    disableClearable
                                    onChange={this.handleChange}
                                    options={this.state.allEmployers.map((option) => option)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Enter a company..."
                                            name="employerName"
                                            margin="normal"
                                            variant="outlined"
                                            onChange={this.handleChange}
                                            InputProps={{ ...params.InputProps, type: 'search' }}
                                        />
                                    )}
                                />
                            </div>
                            <MuiThemeProvider theme={theme}>
                                <ButtonGroup variant="contained" color="primary"
                                             aria-label="contained primary button group"
                                             className="search-button-group">
                                    <Button onClick={this.handleSearch} variant="contained" color="primary" style={{'minWidth':'73px'}}>
                                        <SearchIcon/>
                                    </Button>
                                </ButtonGroup>
                            </MuiThemeProvider>
                        </div>
                    </div>
                    <div className="center-align-container">
                        <div style={{'display':'inline-block'}}>
                            <div style={{'overflow':'hidden'}}>
                                <p className="ep-course-heading italicised" className="search-message">
                                    {this.state.searchMessage}
                                </p>
                            </div>
                            {this.state.employerDetails.map(i => {
                                return (
                                    <div style={{marginBottom:'15px'}}>
                                        <Card style={{width:'750px'}}>
                                            <CardContent>
                                                <div style={{'overflow':'hidden'}}>
                                                    <h4 className="search-card-title">
                                                        <a href={'./view-company/' + i.company} target="_blank" className="search-card-a">
                                                            {i.company}
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div className="row-container">
                                                    <div className="row-container">
                                                        <PersonOutlineIcon className="smaller-icon-padded icon-smaller"/>
                                                        <p className="ep-course-heading">{i.name}</p>
                                                    </div>
                                                </div>
                                                <div className="row-container">
                                                    <div className="row-container">
                                                        <EmailIcon className="smaller-icon-padded icon-smaller"/>
                                                        <p className="ep-course-heading">{i.email}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        );
    }
}

export default SearchEmployer;
