import React, {Component} from 'react';
import {Router, Route, Switch, Link} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Register from "./component/Register/register"
import Login from "./component/Login/login"
import Dashboard from "./component/Dashboard/dashboard"
import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
    apiKey: "AIzaSyAwP9W6GBNU0-gZZtwU1EtWgn3feIsU9hw",
    authDomain: "react-slider-app.firebaseapp.com",
    databaseURL: "https://react-slider-app.firebaseio.com",
    projectId: "react-slider-app",
    storageBucket: "react-slider-app.appspot.com",
    messagingSenderId: "452274135714"
};
firebase.initializeApp(config);
const history = createBrowserHistory();

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router history={history}>
                    <div>
                        <Switch>
                            <Route exact path={'/'} component={Register}/>
                            <Route exact path={'/register'} component={Register}/>
                            <Route exact path={'/login'} component={Login}/>
                            <Route exact path={'/dashboard'} component={Dashboard}/>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
