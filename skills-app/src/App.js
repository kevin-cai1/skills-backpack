import React from 'react';
import {Redirect} from 'react-router-dom';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
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

// component for default index page
function App() {
  /* redirect to user homepage if they are logged in */
  if (SessionDetails.getEmail() != "") {
    return <Redirect to='/home' />
  }
  /* otherwise redirect to generic skill backpack homepage */
  else {
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
