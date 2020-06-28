import React from 'react'
import {
    FormControl,
    TextField,
    Button,
    ButtonGroup,
    InputLabel,
    Select,
    createMuiTheme, MuiThemeProvider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import './login.css';
import SessionDetails from './SessionDetails';

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

    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.setState({ [fieldName]: fieldValue },
            () => { this.validateField(fieldName, fieldValue) });
    }

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

    validateForm() {
        this.setState({formValid: this.state.currentValid && this.state.newValid && this.state.confirmValid});
    }

    handleSubmit(event) {
        // let data = JSON.stringify({
        //     username: this.state.email,
        //     password: this.state.password
        // });
        // let url = 'http://localhost:5000/account/login';
        // console.log('Sending to ' + url + ': ' + data);
        // var xhr = new XMLHttpRequest();
        //
        // xhr.addEventListener('load', () => {
        //     // get the data from the json response
        //     let response = xhr.responseText;
        //     console.log(response);
        //     let status = response["ok"];
        //     let username = response["user"];
        //     if (!status) {
        //         this.state.formError = true;
        //         this.forceUpdate();
        //     } else {
        //         SessionDetails.setEmail("gordon.xie@atlassian.com");
        //         this.state.formSuccess = true;
        //         this.forceUpdate();
        //     }
        // });
        //
        // xhr.open('POST', url);
        // xhr.send(data);
    }

    render() {
        return (
            <div className="App">
                <body className="Login-body">
                <div className="Form-container" style={{marginBottom: "30px"}}>
                    <h3 className="Login-title">Change Password</h3>
                    {this.state.formError === true &&
                    <div className=".Login-alert-row">
                        <div className="Login-alert-container">
                            <Alert className="Login-alert" severity="error">Incorrect email or password.</Alert>
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
                                size="small"
                                className="Login-input-field"
                                onChange={this.handleChange}
                                helperText={this.state.currentValid ? '' : this.state.currentError}
                            />
                        </div>
                        <div className="Login-text-field">
                            <TextField
                                id="new-pw-input"
                                name="newPassword"
                                label="New Password"
                                type="password"
                                variant="outlined"
                                size="small"
                                className="Login-input-field"
                                onChange={this.handleChange}
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
            </div>
        )
    }
}
export default ChangePassword