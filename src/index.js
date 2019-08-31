import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Notfound from './components/notfound';
import AmsWrapper from './components/AmsWrapper';
import * as serviceWorker from './serviceWorker';

import './index.css';
  
const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={AmsWrapper} />
            <Route path="/church_groups" component={AmsWrapper} />
            <Route path="/reports" component={AmsWrapper} />
            <Route path="/members" component={AmsWrapper} />
            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
