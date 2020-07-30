import React from 'react'
import {
    FormControl,
    TextField,
    Button,
    ButtonGroup,
    createMuiTheme, MuiThemeProvider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './login.css';
import SessionDetails from './SessionDetails';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// colour scheme for form
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2D9CDB',
            contrastText: '#fff',
        },
        secondary: {
            main: '#fff',
            contrastText: '#2D9CDB',
        },
    },
});

// component for change password screen
class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            currentError: '',
            newError: '',
            confirmError: '',
            currentValid: true,
            newValid: true,
            confirmValid: true,
            formValid: false,
            passwordInit: false,
            formError: false,
            formSuccess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // method to get value of current input
    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.setState({ [fieldName]: fieldValue },
            () => { this.validateField(fieldName, fieldValue) });
    }

    // method to validate the password fields and display error if invalid
    validateField(field, value) {
        if (field === 'currentPassword') {
            this.state.currentValid =  value.length > 0;
            this.state.currentError = (value.length > 0) ? "" : "New password cannot be empty.";
        }
        else if (field === 'newPassword') {
            this.state.passwordInit = true;
            if (! value.length > 0) {
                this.state.newError = "New password cannot be empty.";
                this.state.newValid = false;
            }
            else if (! value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/i)) {
                this.state.newError = "New password must contain at least one digit, one lower case, one upper case letter and be a minimum of 8 characters.";
                this.state.newValid = false;
            }
            else {
                this.state.newValid = true;
            }
        }
        else if (field === 'confirmPassword') {
            this.state.confirmValid = (value === this.state.newPassword);
            this.state.confirmError = (value === this.state.newPassword) ? "" : "Passwords do not match.";
        }
        this.validateForm();
    }

    // method to check if all fields are valid
    validateForm() {
        this.setState({formValid: this.state.currentValid && this.state.newValid && this.state.confirmValid});
    }

    // method to post new password to API and return response
    handleSubmit(event) {
        let path = 'password/' + SessionDetails.getEmail();
        let data = JSON.stringify({
            "email": SessionDetails.getEmail(),
            "password": this.state.currentPassword,
            "new_password": this.state.newPassword
        });
        return apiHandler(path, 'PUT', data).then( (response) => {
            console.log(response);
            this.state.formError = '';
            this.state.formSuccess = '';
            let status = response["ok"];
            this.setState({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            if (!status) {
                this.state.formError = true;
                this.forceUpdate();
            } else {
                this.state.formSuccess = true;
                this.forceUpdate();
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Navbar/>
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="Login-body">
                <div className="Form-container" style={{marginBottom: "20px"}}>
                    <h3 className="Login-title">Change Password</h3>
                    {this.state.formError === true &&
                    <div className=".Login-alert-row">
                        <div className="Login-alert-container">
                            <Alert className="Login-alert" severity="error">Current password is incorrect.</Alert>
                        </div>
                    </div>
                    }
                    {this.state.formSuccess === true &&
                    <div className=".Login-alert-row">
                        <div className="Login-alert-container">
                            <Alert className="Login-alert" severity="success">Password successfully changed.</Alert>
                        </div>
                    </div>
                    }
                </div>
                <div className="Form-container">
                    <FormControl>
                        <div className="Login-text-field">
                            <TextField
                                id="curr-pw-input"
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                                variant="outlined"
                                value={this.state.currentPassword}
                                size="small"
                                className="Login-input-field"
                                onChange={this.handleChange}
                                helperText={this.state.currentValid ? '' : this.state.currentError}
                            />
                        </div>
                        <div className="Login-text-field" style={{'align-items': "center"}}>
                            <TextField
                                id="new-pw-input"
                                name="newPassword"
                                label="New Password"
                                type="password"
                                variant="outlined"
                                value={this.state.newPassword}
                                size="small"
                                className="Login-input-field"
                                onChange={this.handleChange}
                                style={{'max-width':"220px"}}
                                helperText={this.state.newValid ? '' : this.state.newError}
                            />
                        </div>
                        <div className="Login-text-field">
                            <TextField
                                id="confirm-pw-input"
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                value={this.state.confirmPassword}
                                size="small"
                                className="Login-input-field"
                                onChange={this.handleChange}
                                helperText={this.state.confirmValid ? '' : this.state.confirmError}
                            />
                        </div>
                    </FormControl>
                </div>
                <div className="Login-button-container">
                    <MuiThemeProvider theme={theme}>
                        <ButtonGroup variant="contained" color="primary"
                                     aria-label="contained primary button group">
                            <Button
                                type="submit"
                                disabled={!(this.state.formValid && this.state.passwordInit)}
                                onClick={this.handleSubmit}
                            >Change Password</Button>
                        </ButtonGroup>
                    </MuiThemeProvider>
                </div>
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        )
    }
}
export default ChangePassword
