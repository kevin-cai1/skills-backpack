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
        add_links_open: false,
        EP_Links: [{"link": "link1", "tag": "CBA"}, {"link": "link2", "tag": "Macquarie"}],
      };
      this.handleLogout = this.handleLogout.bind(this);
      this.handleEPLinksModal = this.handleEPLinksModal.bind(this);
      this.handleEPLinksModalClose = this.handleEPLinksModalClose.bind(this);
      this.handleAddLinksModal = this.handleAddLinksModal.bind(this);
      this.handleAddLinksModalClose = this.handleAddLinksModalClose.bind(this);
  }

  handleEPLinksModal() {
      this.setState({ep_links_open: true});
      this.getEportfolioLinks().then( (response) => {
        console.log(response)
        this.setState({EP_Links: response.links})
      });
  }

  handleEPLinksModalClose() {
      this.setState({ep_links_open: false});
  }

  handleAddLinksModal() {
      this.setState({add_links_open: true});
  }

  handleAddLinksModalClose() {
    this.setState({add_links_open: false});
  }

  handleLogout() {
      SessionDetails.removeEmail();
  }
  
  handleEPAdd(e) {
      const password = e.target.tag.value;
      console.log("add ep");
      const response = this.sendEPLink(e).then( (response) => {
          console.log(response);
      });
  }

  sendEPLink(e) {
    let data = JSON.stringify({
        "tag": e.target.tag.value
    });
    let url = 'http://127.0.0.1:5000/ePortfolio/link/' + SessionDetails.getEmail();
    console.log('Sending to ' + url + ': ' + data);

    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: data
    }).then(response => {
        return response.ok && response.json();
    })
        .catch(err => console.log('Error:', err));
  }

  getEportfolioLinks() {
    let url = 'http://127.0.0.1:5000/ePortfolio/link/' + SessionDetails.getEmail();

    console.log('Sending to ' + url);

    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => {
        console.log(response)
        return response.json();
        console.log('response ' + response.status)
    }).catch(err => console.log('Error:', err));
}

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
                        <div>
                            <Card>
                                <CardContent>
                                    <h4 className="ep-course-heading italicised">{i.link}</h4>
                                    <p className="ep-course-heading">{i.tag}</p>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Edit</Button>
                                </CardActions>
                            </Card>
                        </div>
                    )
                })}
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={this.handleAddLinksModal}>
                Create new link
              </Button>
            </div>
          </Dialog>
          <Dialog
            aria-labelledby="form-dialog-title"
            fullWidth='false'
            maxWidth='md'
            open={this.state.add_links_open}
            onClose={this.handleAddLinksModalClose}
          >
            <DialogContent>
              <form onSubmit={(e) => this.handleEPAdd(e)}>
                <Alert severity="info">
                  Add a tag to keep track of your links
                </Alert>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="tag"
                  name="tag"
                  label="Link Tag"
                  type="text"
                  fullWidth
                />
                <Button onClick={this.handleAddLinksModalClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Send
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Home_Candidate;
