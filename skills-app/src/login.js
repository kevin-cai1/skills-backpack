import React from 'react'
import { FormControl, TextField, Button, ButtonGroup, InputLabel, Select, NativeSelect } from '@material-ui/core';
import './login.css';
import {Link} from "react-router-dom";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userType: '',
            emailError: 'Please enter a valid email address.',
            passworError: 'Password cannot be empty.',
            emailValid: true,
            passwordValid: true,
            userTypeValid: true,
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
        console.log('field: ' + field + ", value: " + value);
        if (field === 'email') {
            this.state.emailValid = value.match(/^.*@.*$/i);
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

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.userTypeValid});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Skills Backpack</h1>
                </header>
                <body className="Login-body">
                    <div className="Form-container" style={{marginBottom:"50px"}}>
                        <FormControl variant="outlined" classType="Login-text-field">
                            <InputLabel className="Login-label" htmlFor="outlined-age-native-simple">I'm a ...</InputLabel>
                            <Select
                                className="Login-select"
                                native
                                value={this.state.userType}
                                onChange={this.handleChange}
                                label="Age"
                                inputProps={{
                                    name: 'userType',
                                    id: 'outlined-userType-native-simple',
                                }}
                            >
                                <option aria-label="None" value="" />
                                <option value="Skills Backpack Admin">Skills Backpack Admin</option>
                                <option value="Course Admin">Course Admin</option>
                                <option value="Student">Student</option>
                                <option value="Employer">Employer</option>
                            </Select>
                        </FormControl>
                    </div>
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
                    <br></br>
                    <br></br>
                    {/*<div>*/}
                    {/*    <p><a href='./register'>Don't have an account?</a></p>*/}
                    {/*</div>*/}
                </body>
                <footer className="Home-footer">
                    <p>Yuppies 2020 </p>
                </footer>
            </div>
        )
    }
}
export default Login