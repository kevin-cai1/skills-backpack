import React from 'react';
import SessionDetails from './SessionDetails';

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        SessionDetails.removeEmail();
    }

    render() {
        return (
            <body>
                <h1>Welcome to the homepage { SessionDetails.getEmail()}</h1>
                <p><a href='./login' onClick={this.handleLogout}>Logout</a></p>
            </body>
        );
    }
}