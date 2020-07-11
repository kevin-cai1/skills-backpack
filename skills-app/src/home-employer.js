/* eslint-disable no-use-before-define */
import React from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {makeStyles, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import {Button, ButtonGroup} from '@material-ui/core';
import { theme } from './App.js'

const filter = createFilterOptions();

class Home_Employer extends React.Component {
    constructor(props) {
        super(props);
        const useStyles = makeStyles((theme) => ({
            root: {
                width: 500,
                '& > * + *': {
                    marginTop: theme.spacing(3),
                }
            },
        }));
        this.state = {
            value: null,
            setValue: null,
            valueList:'',
        }
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch() {
        console.log(this.state.valueList);
    }

    render () {
        return (
            <body className="column-container">
            <div style={{'padding-top':'50px','overflow':'hidden'}}>
                <div style={{'float':'right', 'marginRight':'90px'}}>
                    <MuiThemeProvider theme={theme}>
                        <ButtonGroup variant="contained"
                                     aria-label="contained primary button group">
                            <Button href='./my-profile'>
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
                            options={chipNames}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    this.state.setValue({
                                        name: newValue,
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    this.state.setValue({
                                        name: newValue.inputValue,
                                    });
                                } else {
                                    this.state.setValue = newValue;
                                }
                                this.state.valueList = newValue;
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                // Suggest the creation of a new value
                                if (params.inputValue !== '') {
                                    filtered.push({
                                        inputValue: params.inputValue,
                                        name: `Add "${params.inputValue}"`,
                                    });
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
                                return option.name;
                            }}
                            renderOption={(option) => option.name}
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
            </body>
        );
    }
}

export default Home_Employer;

const chipNames = [
    {name: 'css'},
    {name: 'html'},
    {name: 'reactjs'},
    {name: 'python'},
    {name: 'communication'},
]
