import React from 'react';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Home from './components/Home';
import { useUserContext } from './db';
import './styles/index.scss'

const App = () =>{
  const {user} = useUserContext();
 return( 
  <div className="container">
    <Router>
      <Route path="/" exact component={user === null ? Join : Home}/>
      <Route path="/chat" exact component={Chat}/>
    </Router>
  <div className="footer">
    {/* <p>Made By Sushil & Pankaj Dadwal</p> */}
    <p>Check out other Projects <a href="http://susheeesh.com/projects">{"-->Here<--"}</a></p>
  </div>
</div>)
}
export default App;