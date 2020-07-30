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
import { Redirect } from 'react-router-dom';
import SessionDetails from './SessionDetails';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

// login form colour scheme
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

// component to display login form
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userType: '',
            emailError: 'Please enter a valid email address.',
            passwordError: 'Password cannot be empty.',
            emailValid: true,
            passwordValid: true,
            userTypeValid: true,
            formValid: false,
            passwordInit: false,
            formError: false,
            formSuccess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // method to get the newest value in the input field
    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.setState({ [fieldName]: fieldValue },
            () => { this.validateField(fieldName, fieldValue) });
    }

    // method to check whether form fields are valid
    validateField(field, value) {
        if (field === 'email') {
            this.state.emailValid = value.match(/^.+@.+$/i);
        }
        else if (field === 'password') {
            this.state.passwordInit = true;
            this.state.passwordValid = value.length > 0;
        }
        else if (field === 'userType') {
            this.state.userTypeValid = value.match(/^(Skills\sBackpack\sAdmin)|(Course\sAdmin)|(Student)|(Employer)$/i);
        }
        this.validateForm();
    }

    // method to call API, check whether credentials are correct, and get response
    handleSubmit(event) {
        let data = JSON.stringify({
            "email": this.state.email,
            "password": this.state.password
        });
        return apiHandler('account/login', 'POST', data).then( (response) => {
            console.log(response);
            let status = response["logged_in"];
            let email = response["user"];
            let name = response["name"];
            let user_type = response["user_type"];
            this.setState({
                email: '',
                password: '',
                userType: ''
            });
            // display error if credentials incorrect
            if (!status) {
                this.state.formError = true;
                this.forceUpdate();
            }
            // else set user type, name and email
            else {
                SessionDetails.setEmail(email);
                SessionDetails.setType(user_type);
                SessionDetails.setName(name);
                this.state.formSuccess = true;
                this.forceUpdate();
            }
        });
    }

    // check whether all form fields are valid
    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.userTypeValid});
    }

    render() {
        /*  if already logged in, redirect to user's homepage */
        if ((this.state.formSuccess) || (SessionDetails.getEmail() != "")) {
            return <Redirect to='./home' />
        } else {
            /* render login page */
            return (
                <div className="App">
                    <Navbar/>
                    <header className="App-header">
                        <h1>Skills Backpack</h1>
                    </header>
                    <body className="Login-body">
                    <div className="Form-container" style={{marginBottom: "30px"}}>
                        <h3 className="Login-title">Sign In</h3>
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
                                    id="email-input"
                                    name="email"
                                    label="Email Address"
                                    value={this.state.email}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                    helperText={this.state.emailValid ? '' : this.state.emailError}
                                />
                            </div>
                            <div className="Login-text-field">
                                <TextField
                                    id="password-input"
                                    name="password"
                                    label="Password"
                                    value={this.state.password}
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                    helperText={this.state.passwordValid ? '' : this.state.passwordError}
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
                                >Sign In</Button>
                            </ButtonGroup>
                        </MuiThemeProvider>
                    </div>
                    <div className="Register-redirect-container">
                        <p className="Register-redirect-text" style={{alignSelf: "centre"}}>Don't have an account
                            yet? <a href='./register'>Sign up!</a></p>
                    </div>
                    </body>
                    <footer className="Home-footer">
                        <p>Yuppies 2020 </p>
                    </footer>
                </div>
            )
        }
    }
}
export default Login
