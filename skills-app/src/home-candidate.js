import React, { useEffect } from 'react';
import './home.css'
import SessionDetails from './SessionDetails';
import allRoutes from './routes';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { spacing } from '@material-ui/system';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText, FormControl, FormHelperText, Input,
    InputLabel, MenuItem, Select,
    TextField,
    Chip,
    Card, CardContent, Typography, CardActions, ButtonGroup
} from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { theme } from './App.js';

class Home_Candidate extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        ep_links_open: false,
        EP_Links: [{"link": "link1", "tag": "CBA"}, {"link": "link2", "tag": "Macquarie"}],
      };
      this.handleLogout = this.handleLogout.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
      this.handleEPLinksModal = this.handleEPLinksModal.bind(this);
      this.handleEPLinksModalClose = this.handleEPLinksModalClose.bind(this);
  }

  handleEPLinksModal() {
      this.setState({ep_links_open: true});
  }

  handleEPLinksModalClose() {
      this.setState({ep_links_open: false});
  }

  handleLogout() {
      SessionDetails.removeEmail();
  }


  handleFormSubmit = (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const errors = this.validateEmail(email);
      if (errors.length == 0) {
          const response = this.sendSiteAdmin(e).then( (response) => {
              console.log('Final response?: ', response);
              this.setState({ name_details: response.account.name })
              this.setState({ email_details: response.account.email })
              this.setState({ password_details: response.account.password })
          });
          if (response === false) {
            alert("Something went wrong. Try again later.");
          }
          else{
            this.handleSiteAdminModalClose();
            this.handleDetailsOpen();
          }

      }
      else {
          alert(errors);
      }
  };

  render() {
    return (
      <div className="A-page">
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="column-container">
            <div style={{'padding-top':'50px','overflow':'hidden'}}>
                <div style={{'float':'right', 'marginRight':'90px'}}>
                    <MuiThemeProvider theme={theme}>
                        <ButtonGroup variant="contained"
                                     aria-label="contained primary button group">
                            <Button href='./my-eportfolio' style={{textTransform:"none"}}>
                                My E-Portfolio
                            </Button>
                        </ButtonGroup>
                    </MuiThemeProvider>
                </div>
            </div>
            <div className="center-align-container">
                <div style={{'display': 'inline-block'}}>
                    <p>Logged in as: Candidate</p>
                </div>
            </div>
            <div className="A-buttons">
              <MuiThemeProvider theme={theme}>
                <Box m={3}>
                  <Button variant="contained" color="primary" onClick={this.handleEPLinksModal}>
                    View ePortfolio Links
                  </Button>
                </Box>
              </MuiThemeProvider>
            </div>
        </body>
        <footer className="Home-footer">
          <p>Yuppies 2020 </p>
        </footer>
        <MuiThemeProvider theme={theme}>
          <Dialog
            aria-labelledby="form-dialog-title"
            fullWidth='false'
            maxWidth='md'
            open={this.state.ep_links_open}
            onClose={this.handleEPLinksModalClose}
          >
            <div>
                {this.state.EP_Links.map(i => {
                    return (
                        <div style={{marginBottom:'15px'}}>
                            <Card>
                                <CardContent>
                                    <h4>TEST </h4>
                                    <p className="ep-course-heading italicised">{i.link}</p>
                                    <p className="ep-course-heading">{i.tag}</p>
                                    <p>{i.description}</p>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Edit</Button>
                                </CardActions>
                            </Card>
                        </div>
                    )
                })}
            </div>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Home_Candidate;
