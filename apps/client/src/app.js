import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router,Routes, Route, Link} from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Home from './components/Home';
import { useUserContext } from './db';
import './styles/index.scss'

const App = () =>{
  const {user} = useUserContext();
  const socket = useRef();
  const host = window.location.hostname;
  const EndPoint = `ws://${host}:5000`;
  
  useEffect(()=>{
    console.log('component mounted')
    socket.current = io(EndPoint,{
      transports: ['websocket'],
    })

    return ()=>{
      console.log('component unmounted')
      socket.disconnect();
      socket.off();
    }
  },[])

 return( 
  <div className="container">
    <Router>
      <Routes>
        <Route path="/" exact element={user === null ? <Join/> : <Home/>}/>
        <Route path="/chat" exact element={<Chat socket={socket.current}/>}/>
      </Routes>
    </Router>
  <div className="footer">
    {/* <p>Made By Sushil & Pankaj Dadwal</p> */}
    <p>Check out other Projects <a href="http://susheeesh.com/projects">{"-->Here<--"}</a></p>
  </div>
</div>)
}
export default App;