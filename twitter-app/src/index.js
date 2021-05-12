import React from 'react';
import ReactDOM from 'react-dom';
import Tweets from './Tweets';
import AuthHome from './AuthHome';
import Login from './Login';
import Register from './Register'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path='/' exact component={AuthHome} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/:id" exact component={Tweets} />
        </Switch>

    </Router>,
    document.getElementById('root')
);