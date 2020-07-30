import React from 'react';
import './home.css'
import SessionDetails from './SessionDetails';
import {Link, withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import {Dialog, DialogContent, FormControl, TextField, Chip,
    Card, CardContent, CardActions, ButtonGroup, Snackbar} from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { theme } from './App.js';
import MaterialTable from 'material-table';
import Navbar from "./Navbar";
import SearchIcon from '@material-ui/icons/Search';
import apiHandler from './apiHandler';


class Home_Candidate extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        ep_links_open: false,
        add_links_open: false,
        clipboard_open: false,
        EP_Links: [],
        linkTag: '',
        access_times: [],
        columns: [
          {title: 'Tag', field: 'tag'},
          {title: 'Link', field: 'link'},
          {title: 'Last Accessed', field: 'last_accessed'}
        ]
      };
      this.handleLogout = this.handleLogout.bind(this);
      this.handleEPLinksModal = this.handleEPLinksModal.bind(this);
      this.handleEPLinksModalClose = this.handleEPLinksModalClose.bind(this);
      this.handleAddLinksModal = this.handleAddLinksModal.bind(this);
      this.handleAddLinksModalClose = this.handleAddLinksModalClose.bind(this);
      this.handleEPLinkRedirect = this.handleEPLinkRedirect.bind(this);
      this.handleDeleteLink = this.handleDeleteLink.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleEPAdd = this.handleEPAdd.bind(this);
      this.handleCopyOpen = this.handleCopyOpen.bind(this);
      this.handleCopyClose = this.handleCopyClose.bind(this);
  }

  componentDidMount() {
    this.fetchLinks();
    this.fetchAccessTimes();
  }

  handleCopyOpen(rowData) {
    navigator.clipboard.writeText(window.location.origin.toString() + '/eportfolio/' + rowData.link)
    this.setState({clipboard_open: true});
  }

  handleCopyClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({clipboard_open: false});
  }

  handleEPLinkRedirect(e) {
    var link = e
    var new_link = "/eportfolio/" + link;
    this.props.history.push(new_link)
  }

  handleEPLinksModal() {
      this.setState({ep_links_open: true});
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

  handleChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    this.setState({[fieldName]: fieldValue});
    this.componentDidMount();
  }

  handleDeleteLink(object) {
    let path = 'ePortfolio/candidate/' + object.link;
    return apiHandler(path, 'DELETE').then( (repsonse) => {
      this.componentDidMount();
    });
  }

  handleEPAdd() {
      let path = 'ePortfolio/link/' + SessionDetails.getEmail();
      let data = JSON.stringify({
          "tag": this.state.linkTag
      });
      return apiHandler(path, 'POST', data).then( (response) => {
          this.clearModalFields();
          this.handleAddLinksModalClose();
          this.componentDidMount();
      });
  }

  clearModalFields() {
    this.setState({linkTag: ''});
  }

  fetchLinks() {
    let path = 'ePortfolio/link/' + SessionDetails.getEmail();
    return apiHandler(path, 'GET').then( (response) => {
      if (response["ok"]) {
        console.log(response.links)
        this.setState({EP_Links: response.links})
      }
    });
  }

  fetchAccessTimes() {
      let path = 'link/info/' + SessionDetails.getEmail();
      return apiHandler(path, 'GET').then( (response) => {
      if (response['ok']) {
        console.log(response.tracking_info)
        this.setState({access_times: response.tracking_info})
      }
    })
  }

  copyToClipboard(text) {
    var copyText = text;
    copyText.select()
    document.execCommand('copy');
  };

  render() {
    return (
      <div className="A-page">
        <Navbar/>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="column-container">
            <div className="home-float-container">
                <div className="float-right-box">
                    <MuiThemeProvider theme={theme}>
                        <ButtonGroup variant="contained"
                                     aria-label="contained primary button group">
                            <Button variant="contained" href='./my-eportfolio' style={{textTransform:"none"}}>
                                My E-Portfolio
                            </Button>
                        </ButtonGroup>
                    </MuiThemeProvider>
                </div>
            </div>
            <div className="search-company-container">
                <div className="float-left-box">
                    <MuiThemeProvider theme={theme}>
                        <ButtonGroup variant="contained"
                                     aria-label="contained primary button group">
                            <Button variant="contained" color="primary" href='./search-company' style={{textTransform:"none"}}>
                                <SearchIcon/> Search Company
                            </Button>
                        </ButtonGroup>
                    </MuiThemeProvider>
                </div>
            </div>
            <div className="center-align-container">
                <div style={{'display':'inline-block'}}>
                    <h2>Manage E-Portfolio Links</h2>
                </div>
                <div className="main-table">
                  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                  <MaterialTable
                    title="E-Portfolio Links"
                    columns={this.state.columns}
                    data={this.state.access_times}
                    detailPanel={[
                      {
                        tooltip: 'Show Access Times',
                        render: rowData => {
                          return (
                            <div className="link_times">
                              <h3>Link Access Times</h3>
                              {this.state.access_times.filter(i => i.link === rowData.link).map(filteredLink => {
                                return (
                                  filteredLink.times.map(i => {
                                    if (i.time){
                                      return (
                                        <Chip label={i.time} className="skills-chip"/>
                                      )
                                    } else {
                                      return (
                                        <i>Not accessed yet</i>
                                      )
                                    }
                                  })
                                )
                              })}
                              <p></p>

                            </div>
                          )
                        },
                      },
                    ]}
                    onRowClick={(event, rowData) => this.handleEPLinkRedirect(rowData.link)}
                    actions={[
                      {
                        icon: 'delete',
                        tooltip: 'Delete Link',
                        onClick: (event, rowData) => {if(window.confirm('Are you sure you want to delete this link?')){
                          this.handleDeleteLink(rowData);
                        }}
                      },
                      {
                        icon: 'content_copy',
                        tooltip: 'Copy to clipboard',
                        onClick: (event, rowData) => this.handleCopyOpen(rowData)
                      },
                      {
                        icon: 'add',
                        tooltip: 'Add link',
                        isFreeAction: true,
                        onClick: (event) => this.handleAddLinksModal()
                      }
                    ]}
                    options={{
                      actionsColumnIndex: -1,
                      paging: false,
                      search: false,
                    }}
                  />
                </div>
            </div>

        </body>
        <footer className="Home-footer">
          <p>Yuppies 2020 </p>
        </footer>
        <div>
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={this.state.clipboard_open} autoHideDuration={1000} onClose={this.handleCopyClose}>
            <Alert severity="info">Copied to clipboard!</Alert>
          </Snackbar>
        </div>
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
                                    <span id ={`${i.link}`} onClick={this.handleEPLinkRedirect} className="ep-link">{window.location.origin.toString()}/eportfolio/{i.link}</span>
                                    <p className="ep-link-heading">{i.tag}</p>
                                </CardContent>
                                <CardActions>
                                  <div>
                                      <DeleteIcon
                                          style={{'cursor':'pointer','color':'#ad4e3d'}}
                                          onClick={() => this.handleDeleteLink(i.link)}/>
                                  </div>
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
              <form>
                <Alert severity="info">
                  Add a tag to keep track of your links
                </Alert>
                <FormControl fullWidth={true} required={true} margin='normal'>
                    <TextField required label="Tag"
                                name="linkTag"
                                onChange={this.handleChange}
                                value={this.state.linkTag}
                    />
                </FormControl>
              </form>
              <Button onClick={this.handleAddLinksModalClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleEPAdd} color="primary">
                Create
              </Button>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withRouter(Home_Candidate);
