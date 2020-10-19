import React from 'react';
import './App.css';
import Calender from './Calendar'
import {BrowserRouter as Router,Route,Switch} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Calender}>
          </Route>
        </Switch>
        </Router>
    </div>
  );
}

export default App;
