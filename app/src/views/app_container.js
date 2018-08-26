import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import AppIndex from '../components/app/index.js';
import NewSite from '../components/app/newSite.js';
import SiteInfo from '../components/app/siteinfo.js';


const Index = () => {
    return (
        <Router basename="/app">
            <Switch>
                <Route exact path="/index" component={AppIndex} />
                <Route exact path="/start" component={NewSite} />
                <Route exact path="/site_info/:id" component={SiteInfo} />
            </Switch>
        </Router>
    )
}

ReactDOM.render(<Index />, document.getElementById('app'));