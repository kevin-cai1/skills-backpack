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

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        SessionDetails.removeEmail();
    }

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" color="secondary">
                            <MenuIcon />
                        </IconButton>
                        <AssignmentTurnedInIcon />
                        <Typography variant="h6" className={classes.title} color="secondary">
                            &nbsp;Skills Backpack
                        </Typography>
                        {
                            (SessionDetails.getEmail() != "") ?
                                <div>
                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircleIcon />
                                        <Typography variant="h6" className={classes.title} color="secondary">
                                            &nbsp;{SessionDetails.getEmail()}
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
                                        <MenuItem onClick={handleClose}><Link to='./changePassword'>Change Password</Link></MenuItem>
                                        <MenuItem onClick={handleLogout}><Link to='./login'>Logout</Link></MenuItem>
                                    </Menu>
                                </div> :
                                <Button color="secondary"><Link to='./login' className="header-button">Login</Link></Button>

                        }
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
        </div>
    );
}
