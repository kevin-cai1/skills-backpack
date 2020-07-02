import React from 'react';
import SessionDetails from "./SessionDetails";
import {Dialog, DialogActions, DialogContent, DialogContentText, MuiThemeProvider, TextField} from "@material-ui/core";
import {theme} from "./App";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SearchBox from './search-box';

class Candidate_EPortfolio extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            course_admin_open: false,
            site_admin_open: false,
            details_open: false,
            change_password: false,
            name_details: '',
            email_details: '',
            password_details: ''
        };
        // this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCourseAdminModal = this.handleCourseAdminModal.bind(this);
        this.handleSiteAdminModal = this.handleSiteAdminModal.bind(this);
        this.handleCourseAdminModalClose = this.handleCourseAdminModalClose.bind(this);
        this.handleSiteAdminModalClose = this.handleSiteAdminModalClose.bind(this);
        this.handleDetailsOpen = this.handleDetailsOpen.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
    }

    handleCourseAdminModal() {
        this.setState({course_admin_open: true});
    }

    handleSiteAdminModal() {
        this.setState({site_admin_open: true});
    }

    handleCourseAdminModalClose() {
        this.setState({course_admin_open: false});
    }

    handleSiteAdminModalClose() {
        this.setState({site_admin_open: false});
    }

    handleDetailsOpen() {
        this.setState({details_open: true});
    }

    handleDetailsClose() {
        this.setState({details_open: false});
    }


    render() {
        return (
            <div className="A-page">
                <body className="A-body">
                <p>Logged in as: Candidate</p>
                <div className="A-buttons">
                    <MuiThemeProvider theme={theme}>
                        <Box m={3}>
                            <Button variant="contained" color="primary" onClick={this.handleCourseAdminModal}>
                                Add skill
                            </Button>
                        </Box>
                    </MuiThemeProvider>
                </div>
                </body>
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.course_admin_open}
                        onClose={this.handleCourseAdminModalClose}
                    >
                        <DialogContent>
                            <DialogContentText type="title" id="modal-title">
                                Search Skills
                            </DialogContentText>
                            <SearchBox
                                data={"skills"}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCourseAdminModalClose} color="primary">
                                Cancel
                            </Button>
                            <Button color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.site_admin_open}
                        onClose={this.handleSiteAdminModalClose}
                    >
                        <DialogContent>
                            <form>
                            {/*<form onSubmit={(e) => this.handleFormSubmit(e)}>*/}
                                <DialogContentText type="title" id="modal-title">
                                    New Skills Backpack admin details
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    required
                                    margin="normal"
                                    id="name"
                                    name="name"
                                    label="Full Name"
                                    type="text"
                                    fullWidth
                                />
                                <TextField
                                    required
                                    margin="normal"
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                />
                                <Button onClick={this.handleSiteAdminModalClose} color="primary">
                                    Cancel
                                </Button>
                                <Button type="submit" color="primary">
                                    Create
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </MuiThemeProvider>
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        aria-labelledby="form-dialog-title"
                        open={this.state.details_open}
                        onClose={this.handleDetailsClose}
                    >
                        <DialogContent>
                            <DialogContentText type="title" id="modal-title">
                                Admin account has been created!
                            </DialogContentText>
                            <DialogContentText type="title" id="modal-title">
                                Copy below details to login and change password
                            </DialogContentText>
                            <DialogContent>
                                <p>
                                    Name: {this.state.name_details}
                                </p>
                                <p>
                                    Email: {this.state.email_details}
                                </p>
                                <p>
                                    Temporary Password: {this.state.password_details}
                                </p>
                            </DialogContent>
                            <Button onClick={this.handleDetailsClose} color="primary">
                                OK
                            </Button>
                        </DialogContent>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Candidate_EPortfolio;
