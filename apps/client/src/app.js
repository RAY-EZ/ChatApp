import React from 'react';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import './styles/index.scss'

const App = () => ( 
  <div className="container">
    <Router>
      <Route path="/" exact component={Join}/>
      <Route path="/chat" exact component={Chat}/>
    </Router>
  <div className="footer">
    {/* <p>Made By Sushil & Pankaj Dadwal</p> */}
    <p>Check out other Projects <a href="http://susheeesh.com/projects">{"-->Here<--"}</a></p>
  </div>
</div>
);

export default App;