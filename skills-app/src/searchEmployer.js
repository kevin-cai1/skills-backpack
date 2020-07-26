/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import {Button, ButtonGroup, Card, CardActions, CardContent} from '@material-ui/core';
import { theme } from './App.js'
import EmailIcon from '@material-ui/icons/Email';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import Navbar from "./Navbar";

class SearchEmployer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allEmployers: [],
            employerName: '',
            employerDetails: [],
            searchMessage: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.populateDropdown();
    }

    getEmployers() {
        let url = 'http://localhost:5000/search/searchemployers';
        console.log('Fetching data from: ' + url);

        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log(response)
            console.log('response ' + response.status)
            return response.ok && response.json();
        })
            .catch(err => console.log('Error:', err));
    }

    populateDropdown() {
        return this.getEmployers().then( (response) => {
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

    postEmployer() {
        let data = JSON.stringify({
            "employer_name": this.state.employerName
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

    handleSearch() {
        return this.postEmployer().then( (response) => {
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
                <body className="column-container" style={{'min-height':'500px'}}>
                <div className="center-align-container">
                    <div style={{'display': 'inline-block','padding-top':'40px'}}>
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
                                             style={{'height':'56px','marginTop':'15px'}}>
                                    <Button onClick={this.handleSearch} variant="contained" color="primary" style={{'minWidth':'73px'}}>
                                        <SearchIcon/>
                                    </Button>
                                </ButtonGroup>
                            </MuiThemeProvider>
                        </div>
                    </div>
                    <div className="center-align-container" style={{'margin':'15px 0px 150px 0px'}}>
                        <div style={{'display':'inline-block'}}>
                            <div style={{'overflow':'hidden'}}>
                                <p className="ep-course-heading italicised" style={{float:'left','font-style':'normal','marginBottom':'10px'}}>
                                    {this.state.searchMessage}
                                </p>
                            </div>
                            {this.state.employerDetails.map(i => {
                                return (
                                    <div style={{marginBottom:'15px'}}>
                                        <Card style={{width:'750px'}}>
                                            <CardContent>
                                                <div style={{'overflow':'hidden'}}>
                                                    <h4 style={{margin:'10px 0px 10px 0px',float:'left','text-decoration':'none'}}>
                                                        <a href={'./view-company/' + i.company} target="_blank" style={{'text-decoration':'none', color:'#2D9CDB'}}>
                                                            {i.company}
                                                        </a>
                                                    </h4>
                                                </div>
                                                <div className="row-container">
                                                    <div className="row-container">
                                                        <PersonOutlineIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
                                                        <p className="ep-course-heading">{i.name}</p>
                                                    </div>
                                                </div>
                                                <div className="row-container">
                                                    <div className="row-container">
                                                        <EmailIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
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
