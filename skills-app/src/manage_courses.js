import React from 'react';
import './manage_courses.css';
import MaterialTable from 'material-table';
import { DeleteIcon, EditIcon, GroupIcon } from '@material-ui/icons';
import {Link, Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { theme } from './App.js';

class Manage_Courses extends React.Component {
  constructor(props) {
      super(props);
      this.state = ({
        columns: [
          { title: 'Code', field: 'code' },
          { title: 'Name', field: 'name' },
        ],
        data: [
          { code: 'COMP3900', name: 'Computer Science Project' },
          { code: 'COMP2041', name: 'Software Tools' },
        ],
      });
  }

  render() {
    return(
      <div>
        <header className="App-header">
            <h1>Skills Backpack</h1>
        </header>
        <body className="Manage-course-body">
          <h1>My Courses</h1>
          <div className="Top-right">
            <MuiThemeProvider theme={theme}>
              <Box m={3}>
                <Button variant="contained" color="primary" component={Link} to="/course_create">
                  Create new course
                </Button>
              </Box>
            </MuiThemeProvider>
          </div>
          <div className="Main-table">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <MaterialTable
              columns={this.state.columns}
              data={this.state.data}
              title="My Courses"
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        this.setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      this.setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
              }}
            />
          </div>
        </body>
        <footer className="Home-footer">
            <p>Yuppies 2020 </p>
        </footer>
      </div>
    )
  }
}

export default Manage_Courses
