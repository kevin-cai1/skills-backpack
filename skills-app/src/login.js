import React from 'react'
import { FormControl, TextField, Button, ButtonGroup } from '@material-ui/core';
import './login.css';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailError: 'Please enter a valid email address.',
            passworError: 'Password cannot be empty.',
            emailValid: true,
            passwordValid: true,
            formValid: false,
            passwordInit: false
        };

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        this.setState({ [fieldName]: fieldValue },
            () => { this.validateField(fieldName, fieldValue) });
    }

    validateField(field, value) {
        if (field === 'email') {
            this.state.emailValid = value.match(/^.*@.*$/i);
        }
        else if (field === 'password') {
            this.state.passwordInit = true;
            this.state.passwordValid = value.length > 0;
        }
        this.validateForm();
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="Login-body">
                    <div className="Form-container">
                        <FormControl>
                            <div className="Login-text-field">
                                <TextField
                                    id="email-input"
                                    name="email"
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    onChange={this.handleChange}
                                    helperText={this.state.emailValid ? '' : this.state.emailError}
                                />
                            </div>
                            <div className="Login-text-field">
                                <TextField
                                    id="password-input"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    onChange={this.handleChange}
                                    helperText={this.state.passwordValid ? '' : this.state.passworError}
                                />
                            </div>
                        </FormControl>
                    </div>
                    <div className="Login-button-container">
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                            <Button
                                type="submit" disabled={!(this.state.formValid && this.state.passwordInit)}>Login</Button>
                        </ButtonGroup>
                    </div>
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        )
    }
}
export default Login