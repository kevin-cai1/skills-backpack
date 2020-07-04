import React from 'react';
import SessionDetails from "./SessionDetails";
import {Dialog, DialogActions, DialogContent, DialogContentText, MuiThemeProvider, TextField} from "@material-ui/core";
import {theme} from "./App";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SearchBox from './search-box';
import {Alert} from "@material-ui/lab";

class Candidate_EPortfolio extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            search_skills_open: false,
            newSkill: '',
            addSkillSuccess: false,
            addSkillSuccessMessage: '',
        };
        this.handleSearchSkillsModal = this.handleSearchSkillsModal.bind(this);
        this.handleSearchSkillsModalClose = this.handleSearchSkillsModalClose.bind(this);
        this.handleAddSkill = this.handleAddSkill.bind(this);
        this.handleClearStatus = this.handleClearStatus.bind(this);
    }

    handleSearchSkillsModal() {
        this.setState({search_skills_open: true});
    }

    handleSearchSkillsModalClose() {
        this.setState({search_skills_open: false});
        this.handleClearStatus();
    }

    handleAddSkill() {
        //API call
        let result = true;
        this.setState({addSkillSuccessMessage: 'Successfully added \'' + this.state.newSkill + '\'.'});
        this.state.addSkillSuccess = true;
        this.forceUpdate();
    }

    handleClearStatus() {
        this.state.addSkillSuccess = false;
        this.state.newSkill = '';
        this.forceUpdate();
    }

    callbackFunction = (childData) => {
        if (! (childData == null)) {
            if (childData.hasOwnProperty('inputValue')) {
                this.setState({newSkill: childData.inputValue});
            }
            else {
                this.setState({newSkill: childData.title});
            }
        }
    }

    render() {
        return (
            <div className="A-page">
                <body className="A-body">
                <p>Logged in as: Candidate</p>
                <div className="A-buttons">
                    <MuiThemeProvider theme={theme}>
                        <Box m={3}>
                            <Button variant="contained" color="primary" onClick={this.handleSearchSkillsModal}>
                                Add skill
                            </Button>
                        </Box>
                    </MuiThemeProvider>
                </div>
                </body>
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
                            <Alert className="Login-alert" severity="success" style={{"margin-bottom":"8px"}}>
                                {this.state.addSkillSuccessMessage}
                            </Alert>

                            }
                            <SearchBox
                                data={"skills"}
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
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Candidate_EPortfolio;
