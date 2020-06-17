import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import allRoutes from './routes';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { spacing } from '@material-ui/system';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
  return (
    <div className="App">
      <header className="App-header">
        <h1>Skills Backpack</h1>
      </header>
      <body className="Home-body">
        <MuiThemeProvider theme={theme}>
          <Box m={3}>
            <Button variant="contained" color="primary" component={Link} to="./login">
              Login
            </Button>
          </Box>
          <Box m={3}>
            <Button variant="contained" color="secondary" component={Link} to="./register">
              Register
            </Button>
          </Box>
        </MuiThemeProvider>
      </body>
      <footer className="Home-footer">
        <p>Yuppies 2020 </p>
      </footer>
    </div>
  );
}

export { theme };
export default App;
