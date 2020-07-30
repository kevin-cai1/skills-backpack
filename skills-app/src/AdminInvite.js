import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    Redirect
} from 'react-router-dom'
import { Alert } from '@material-ui/lab';
import {
    FormControl,
    TextField,
    Button,
    ButtonGroup,
    InputLabel,
    Select,
    createMuiTheme, MuiThemeProvider
} from '@material-ui/core';
import SessionDetails from './SessionDetails';
import Navbar from "./Navbar";
import apiHandler from './apiHandler';

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

class AdminInvite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            university: '',
            passwordError: 'Password cannot be empty.',
            matchError: 'Passwords do not match.',
            passwordMatch: true,
            passwordValid: true,
            nameValid: true,
            universityValid: true,
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

    // validate field inputs
    validateField(field, value) {
        if (field === 'password') {
            this.state.passwordValid = value.length > 0;
            console.log(value)
        } else if (field === 'name') {
            this.state.nameValid = value.length > 0;
        } else if (field === 'university') {
            this.state.universityValid = value.length > 0;
        } else if (field === 'password2') {
            this.state.passwordInit = true;
            this.state.passwordMatch = value.length > 0 && value === this.state.password
        }

        this.validateForm();
    }

    // submit details to create an account
    postSignup() {
        let data = JSON.stringify({
            "email": this.state.email,
            "password": this.state.password,
            "university": this.state.university,
            "name": this.state.name,
            "user_type": "courseAdmin"

        });
        let url = 'http://localhost:5000/account/create';
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

    // handle sign up submission
    handleSubmit(event) {
        return this.postSignup().then( (response) => {
            let status = response["ok"];
            if (!status) {
                this.state.formError = true;
                this.forceUpdate();
            } else {
                let email = response["account"]["email"];
                let name = response["account"]["name"];
                SessionDetails.setEmail(email);
                SessionDetails.setType("courseAdmin");
                SessionDetails.setName(name);
                this.state.formSuccess = true;
                this.forceUpdate();
            }
        });
    }

    validateForm() {
        this.setState({formValid: this.state.passwordValid && this.state.passwordMatch && this.state.universityValid && this.state.nameValid});
    }

    componentDidMount() {
        const { match: { params } } = this.props;

        let path = 'course_admin/email/decode';
        let data = JSON.stringify({
            "token": params.email
        });
        // decrypt email from url token
        return apiHandler(path, 'POST', data).then( (response) => {
            this.setState({email: response.email})
        });
    }

    render() {
        if ((this.state.formSuccess) || (SessionDetails.getEmail() != "")) {
            console.log("REDIRECTING TO HOME")
            return <Redirect to='../home' />
        } else {
            console.log(this.state.email)
            const userEmail = this.state.email
            console.log("RENDER")
            return (
                <div className="App">
                    <Navbar/>
                    <header className="App-header">
                        <h1>Skills Backpack</h1>
                    </header>
                    <body className="Login-body">
                    <div className="Form-container" style={{marginBottom: "10px"}}>
                        <h3 className="Login-title">Welcome { userEmail }</h3>
                        {this.state.formError === true &&
                        <div className=".Login-alert-row">
                            <div className="Login-alert-container">
                                <Alert className="Login-alert" severity="error">User already exists</Alert>
                            </div>
                        </div>
                        }
                    </div>
                    <div className="Form-container">
                        <p className="Register-redirect-text" style={{alignSelf: "centre"}}>Fill in the details to finish creating your account</p>
                    </div>
                    <div className="Form-container">
                        <FormControl>
                            <div className="Login-text-field">
                                <TextField
                                    id="name-input"
                                    name="name"
                                    label="Name"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="Login-text-field">
                                <TextField
                                    id="university-input"
                                    name="university"
                                    label="University"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                />
                            </div>
                            {/*<h5 className="Login-field-title">Password</h5>*/}
                            <div className="Login-text-field">
                                <TextField
                                    id="password-input"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                    helperText={this.state.passwordInit ? '' : this.state.passwordError}
                                />
                            </div>
                            <div className="Login-text-field">
                                <TextField
                                    id="password-input"
                                    name="password2"
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                    helperText={this.state.passwordMatch ? '' : this.state.matchError}
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
                                    disabled={!(this.state.formValid && this.state.passwordInit && this.state.passwordMatch)}
                                    onClick={this.handleSubmit}
                                >Create Account</Button>
                            </ButtonGroup>
                        </MuiThemeProvider>
                    </div>
                    <div className="Register-redirect-container">
                        <p className="Register-redirect-text" style={{alignSelf: "centre"}}>Already have an account? <a href='../login'>Sign in!</a></p>
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

export default AdminInvite