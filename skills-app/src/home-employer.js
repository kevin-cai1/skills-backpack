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

const filter = createFilterOptions();

class Home_Employer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            setValue: null,
            valueList: [],
            allOutcomes: [],
            candidateList: [],
            numResults: '',
            searchMessage: '',
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        this.populateDropdown();
    }

    postOutcomes() {
        let data = JSON.stringify({
            "attributes": this.state.valueList
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

    handleSearch() {
        this.state.candidateList = [];
        let searchValues = JSON.stringify(this.state.valueList);
        searchValues = searchValues.replace(/\"/g, '');
        searchValues = searchValues.replace(/\[/g, '');
        searchValues = searchValues.replace(/\]/g, '');
        searchValues = searchValues.replace(/\,/g, '\, ');
        return this.postOutcomes().then( (response) => {
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

    getOutcomes() {
        let url = 'http://localhost:5000/search/getoutcomes';
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
        return this.getOutcomes().then( (response) => {
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
            <body className="column-container">
            <div style={{'padding-top':'50px','overflow':'hidden'}}>
                <div style={{'float':'right', 'marginRight':'90px'}}>
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
                <div style={{'display': 'inline-block','padding-top':'40px'}}>
                    <h3>Candidate Search</h3>
                    <div style={{
                        width: 500,
                        '& > * + *': {
                        marginTop: '3px',
                    },
                    }}>
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
                                    // Create a new value from the user input
                                    this.state.setValue = newValue.inputValue;
                                } else {
                                    this.state.setValue = newValue;
                                }
                                this.state.valueList = newValue;
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                // Suggest the creation of a new value
                                if (params.inputValue !== '') {
                                    filtered.push(
                                        params.inputValue
                                    );
                                }

                                return filtered;
                            }}
                            getOptionLabel={(option) => {
                                // Value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                // Add "xxx" option created dynamically
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                // Regular option
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
            <div className="center-align-container" style={{'margin':'15px 0px 30px 0px'}}>
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
            </body>
        );
    }
}

export default Home_Employer;
