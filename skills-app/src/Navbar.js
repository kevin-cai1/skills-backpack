import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SessionDetails from './SessionDetails';
import './main.css';
import { Menu, MenuItem } from '@material-ui/core';
import { useHistory } from "react-router-dom";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2b2b2b'
        },
        secondary: {
            main: '#ffffff'
        }
    },
});


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            setAnchorEl: null,
            open: false,
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleMenu = this.handleMenu.bind(this);
    }

    handleMenu(event) {
        this.setState({
            setAnchorEl: event.currentTarget,
            open: true
        });
    }

    handleClose() {
        this.setState({
            setAnchorEl: null,
            open: false
        });
    }

    handleLogout() {
        this.state.setAnchorEl = null;
        SessionDetails.removeEmail();
    }

    changeRoute() {
        this.props.history.push('/home');
    }

    render() {
        return (
            <div className="navbar-root">
                <MuiThemeProvider theme={theme}>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <IconButton edge="start" color="inherit" aria-label="menu" color="secondary">
                                <MenuIcon />
                            </IconButton>
                            <div onClick={this.changeRoute} style={{"overflow":"auto","cursor": "pointer"}}>
                                <div style={{"float":"left"}}><AssignmentTurnedInIcon /></div>
                                <div style={{"overflow":"hidden"}}>
                                    <Typography variant="h6" className="navbar-root" color="secondary">
                                        &nbsp;Skills Backpack
                                    </Typography>
                                </div>
                            </div>
                            {
                                (SessionDetails.getEmail() != "") ?
                                    <div style={{"margin-left":"auto","margin-right":"0"}}>
                                        <IconButton
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={this.handleMenu}
                                            color="inherit"
                                        >
                                            <AccountCircleIcon />
                                            <Typography variant="h6" className="navbar-root" color="secondary">
                                                &nbsp;{SessionDetails.getName()}
                                            </Typography>
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={this.state.anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                        >
                                            <MenuItem onClick={this.handleClose}><Link to='./changePassword' style={{'text-decoration':'none','color':'black'}}
                                            >Change Password</Link></MenuItem>
                                            <MenuItem onClick={this.handleLogout}><Link to='./' style={{'text-decoration':'none','color':'black'}}
                                            >Logout</Link></MenuItem>
                                        </Menu>
                                    </div> :
                                    <div style={{"margin-left":"auto","margin-right":"0"}}>
                                        <Button color="secondary"><Link to='./login' className="header-button">Login</Link></Button>
                                    </div>
                            }
                        </Toolbar>
                    </AppBar>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default Navbar;
