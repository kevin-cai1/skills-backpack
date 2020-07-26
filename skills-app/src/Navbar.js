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

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Navbar() {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const history = useHistory();
    const loggedIn = (SessionDetails.getEmail() != '') ? true : false;
    const [auth, setAuth] = React.useState(loggedIn);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        SessionDetails.removeEmail();
        SessionDetails.removeName();
        SessionDetails.removeType();
        setAuth(false);
        history.push("./");
    }

    const changeRoute = () => {
        if (auth) {
            history.push("./home");
        }
        else {
            history.push("./");
        }
    }

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <div onClick={changeRoute} style={{"overflow":"auto","cursor": "pointer"}}>
                            <div style={{"float":"left"}}><AssignmentTurnedInIcon /></div>
                            <div style={{"overflow":"hidden"}}>
                                <Typography variant="h6" className={classes.title} color="secondary">
                                    &nbsp;Skills Backpack
                                </Typography>
                            </div>
                        </div>
                        {
                            (auth) ?
                                <div style={{"margin-left":"auto","margin-right":"0"}}>
                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircleIcon />
                                        <Typography variant="h6" className={classes.title} color="secondary">
                                            &nbsp;{SessionDetails.getName()}
                                        </Typography>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose}><Link to='./changePassword' style={{'text-decoration':'none','color':'black'}}
                                        >Change Password</Link></MenuItem>
                                        <MenuItem onClick={handleLogout}><Link to='./' style={{'text-decoration':'none','color':'black'}}
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