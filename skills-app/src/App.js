import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import allRoutes from './routes';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { spacing } from '@material-ui/system';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import SessionDetails from './SessionDetails';
import Background from './images/employer.jpg';
import Navbar from "./Navbar";

//colour themes for text, buttons and smaller elements used throughout this app
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

function App() {
  if (SessionDetails.getEmail() != "") {
    return <Redirect to='/home' />
  } else {
    return (
        <div>
            <Navbar/>
            <img src={Background} style={{width:"100%"}}></img>
            <div className="centered">
                <h1 className="app-title">Skills Backpack</h1>
                <h3 className="app-subtitle">Empowering students. Connecting employers with talent.</h3>
            </div>
        </div>
    );
  }
}

export { theme };
export default App;
