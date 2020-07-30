/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import {Button, ButtonGroup, Card, CardActions, CardContent} from '@material-ui/core';
import { theme } from './App.js'
import SessionDetails from "./SessionDetails";
import LanguageIcon from "@material-ui/core/SvgIcon/SvgIcon";
import EmailIcon from '@material-ui/icons/Email';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

const filter = createFilterOptions();

// component to display the employer homepage
class Home_Employer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null, // value of current search input
            setValue: null, // newly entered value
            valueList: [], // list of all skills added to the search criteria
            allOutcomes: [], // list of outcomes to populate the search dropdown
            candidateList: [], // list of all candidates that match the search criteria
            numResults: '', // number of candidates matching the search criteria
            searchMessage: '', // message to indicate success or fail upon search
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.populateDropdown();
    }

    // method to post candidate search results and return response
    handleSearch() {
        this.state.candidateList = [];
        let searchValues = JSON.stringify(this.state.valueList);
        searchValues = searchValues.replace(/\"/g, '');
        searchValues = searchValues.replace(/\[/g, '');
        searchValues = searchValues.replace(/\]/g, '');
        searchValues = searchValues.replace(/\,/g, '\, ');
        let data = JSON.stringify({
            "attributes": this.state.valueList
        });
        return apiHandler('search/search', 'POST', data).then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                console.log("No results found.");
                this.setState({
                    candidateList: [],
                    searchMessage: "No results found for " + searchValues + ". Try selecting different skills."
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
                    searchMessage: candidateList.length + " result(s) for " + searchValues
                });
            }
        });
    }

    // method to get common skills/graduate outcomes and populate the search dropdown
    populateDropdown() {
        return apiHandler('search/getoutcomes', 'GET').then( (response) => {
            console.log(response);
            let status = response["ok"];
            if (!status) {
                console.log("error");
            } else {
                let outcomes = response["outcomes"];
                this.setState({
                    allOutcomes: outcomes
                });
            }
        });
    }

    render () {
        return (
            <div className="A-page">
                <Navbar/>
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="column-container">
                <div className="home-float-container">
                    <div className="float-right-box">
                        <MuiThemeProvider theme={theme}>
                            <ButtonGroup variant="contained"
                                         aria-label="contained primary button group">
                                <Button href='./my-profile' style={{textTransform:"none"}}>
                                    My Profile
                                </Button>
                            </ButtonGroup>
                        </MuiThemeProvider>
                    </div>
                </div>
                <div className="center-align-container">
                    <div className="search-inline">
                        <h3>Candidate Search</h3>
                        /* Search Bar */
                        <div className="search-style">
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                options={this.state.allOutcomes}
                                getOptionLabel={(option) => option}
                                filterSelectedOptions
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        this.state.setValue({
                                            name: newValue,
                                        });
                                    } else if (newValue && newValue.inputValue) {
                                        this.state.setValue = newValue.inputValue;
                                    } else {
                                        this.state.setValue = newValue;
                                    }
                                    this.state.valueList = newValue;
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    if (params.inputValue !== '') {
                                        filtered.push(
                                            params.inputValue
                                        );
                                    }

                                    return filtered;
                                }}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'string') {
                                        return option;
                                    }
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    return option;
                                }}
                                renderOption={(option) => option}
                                renderInput={(params) => (
                                    <div className="row-container">
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Enter some skills.."
                                        />
                                        <MuiThemeProvider theme={theme}>
                                            <ButtonGroup variant="contained" color="primary"
                                                         aria-label="contained primary button group">
                                                <Button onClick={this.handleSearch} variant="contained" color="primary" style={{'minWidth':'73px'}}>
                                                    <SearchIcon/>
                                                </Button>
                                            </ButtonGroup>
                                        </MuiThemeProvider>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="center-align-container search-results">
                    <div className="center-box">
                        /* Search Bar Results */
                        <div className="search-company-container">
                            <p className="ep-course-heading italicised search-message">
                                {this.state.searchMessage}
                            </p>
                        </div>
                        {this.state.candidateList.map(i => {
                            return (
                                <div style={{marginBottom:'15px'}}>
                                    <Card style={{width:'750px'}}>
                                        <CardContent>
                                            <div className="align-left-box">
                                                <h4 className="search-card-title">
                                                    <a href={'./view-eportfolio/' + i.email} target="_blank" className="search-card-a">
                                                        {i.name}
                                                    </a>
                                                </h4>
                                            </div>
                                            <div className="align-left-box">
                                                <p className="ep-course-heading italicised result-p">{i.degree} Student</p>
                                            </div>
                                            <div className="row-container">
                                                <div className="row-container">
                                                    <EmailIcon className="smaller-icon-padded" style={{'font-size':'15px'}}/>
                                                    <p className="ep-course-heading">{i.email}</p>
                                                </div>
                                            </div>
                                            <div className="align-left-box">
                                                <p className="ep-course-heading italicised skill-list-p">
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
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        );
    }
}

export default Home_Employer;
