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

    return (
        <div className={classes.root}>
            <MuiThemeProvider theme={theme}>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" color="secondary">
                            <MenuIcon />
                        </IconButton>
                        <AssignmentTurnedInIcon color="secondary"/>
                        <Typography variant="h6" className={classes.title} color="secondary">
                            &nbsp;Skills Backpack
                        </Typography>
                        {
                            (SessionDetails.getEmail() != "") ?
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" color="secondary">
                                    <AccountCircleIcon />
                                    <Typography variant="h6" className={classes.title} color="secondary">
                                        &nbsp;Alexandra Gu
                                    </Typography>
                                </IconButton> :
                                <Button color="secondary"><Link to ='./login'>Login</Link></Button>

                        }
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
        </div>
    );
}
