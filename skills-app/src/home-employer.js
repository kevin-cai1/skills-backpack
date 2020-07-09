/* eslint-disable no-use-before-define */
import React from 'react';
import { TextField, Chip, InputAdornment } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import AccountCircle from '@material-ui/icons/AccountCircle';

const filter = createFilterOptions();

const chipNames = [
    {name: 'css'},
    {name: 'html'},
    {name: 'reactjs'},
    {name: 'python'},
    {name: 'communication'},
]

class Home_Employer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            setValue: null,
            addedSkills: [],
            searchValue: '',
        }
        this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
    }

    addSkill(skill) {
        this.state.addedSkills.push(skill);
        this.state.searchValue = '';
        this.state.value = null;
        this.state.newValue = null;
        this.forceUpdate();
    }

    handleDeleteSkill(name) {
        var tempSkills = [...this.state.addedSkills];
        var index = tempSkills.indexOf(name);
        if (tempSkills !== -1) {
            tempSkills.splice(index, 1);
            this.setState({addedSkills: tempSkills});
        }
        this.forceUpdate();
    }

    render () {
        return (
            <body className="column-container">
            <div className="center-align-container">
                <div style={{'display': 'inline-block','padding-top':'100px'}}>
                    <h3>Candidate Search</h3>
                    <Autocomplete
                        value={this.state.value}
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
                                this.addSkill(newValue);
                            }
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
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={chipNames}
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
                        style={{ width: 600, height: 400 }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                {...params}
                               label="Search.."
                                color="primary"
                                variant="outlined"
                                value={this.state.searchValue}
                                multiline
                                rowsMax={3}
                                InputProps={{
                                    ...params.InputProps, startAdornment: (
                                        <InputAdornment position="start">
                                            { this.state.addedSkills.map(i =>
                                                <Chip label={i.name} color="primary" onDelete={() => this.handleDeleteSkill(i)} style={{'margin':'0px 2px'}}/>
                                            )}
                                         </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            </body>
        );
    }
}

export default Home_Employer;