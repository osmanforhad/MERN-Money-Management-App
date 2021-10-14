import { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'


import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
