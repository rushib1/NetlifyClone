import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import Login from '../components/auth/auth_login.js';


const AuthIndex = () => {
    return (
        <Router basename="/auth">
            <Switch>
                <Route exact path="/signin" component={Login} />
            </Switch>
        </Router>
    )
}

ReactDOM.render(<AuthIndex />, document.getElementById('app'));