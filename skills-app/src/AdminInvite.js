import React from 'react'
import {
    BrowserRouter as Router,
    Link,
    Redirect
} from 'react-router-dom'

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
    render() {
        if ((this.state.formSuccess) || (SessionDetails.getEmail() != "")) {
            return <Redirect to='./home' />
        } else {
            return (
                <div className="App">
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
                        <FormControl variant="outlined" classType="Login-text-field">
                            <InputLabel className="Login-label" htmlFor="outlined-age-native-simple">I'm a
                                ...</InputLabel>
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
                                <option aria-label="None" value=""/>
                                <option value="Skills Backpack Admin">Skills Backpack Admin</option>
                                <option value="Course Admin">Course Admin</option>
                                <option value="Student">Student</option>
                                <option value="Employer">Employer</option>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="Form-container">
                        <FormControl>
                            {/*<h5 className="Login-field-title">Email Address</h5>*/}
                            <div className="Login-text-field">
                                <TextField
                                    id="email-input"
                                    name="email"
                                    label="Email Address"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    className="Login-input-field"
                                    onChange={this.handleChange}
                                    helperText={this.state.emailValid ? '' : this.state.emailError}
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
                                    helperText={this.state.passwordValid ? '' : this.state.passworError}
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

export default AdminInvite