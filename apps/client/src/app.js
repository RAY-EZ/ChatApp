import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router,Routes, Route, Link, useParams} from 'react-router-dom';
import createURL from './utils/createUrl';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Home from './components/Home';
import NoMatch from './components/NoMatch';
import { useUserContext } from './db';
import './styles/index.scss'

const App = () =>{
  const {user} = useUserContext();
  const [Socket, setSocket] = useState(null)
  const host = window.location.hostname;
  const EndPoint = createURL(`/`, 'ws:');

  useEffect(()=>{
    console.log('component mounted')
    let socket= io(EndPoint.href,{
      transports: ['websocket'],
      autoConnect: false,
      path:'/ws/socket-io'
    })
    // socket.connect();
    socket.on('connect',()=>{
      console.log('\x1b[1;32m%s\x1b[0m', 'connected');
    })
    setSocket(socket);
    console.log('1st')
    return ()=>{
      console.log('component unmounted')
      socket.disconnect();
      socket.off();
    }
  },[])

  if(!Socket){
    return (
      <h1>Connecting to server</h1>
    )
  }

 return( 
  <div className="container">
    <Router>
      <Routes>
        <Route path="/" exact element={user === null ? <Join/> : <Home socket={Socket}/>}/>
        <Route path="/chat/:groupid" exact element={<Chat socket={Socket}/>}/>
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </Router>
  <div className="footer">
    {/* <p>Made By Sushil & Pankaj Dadwal</p> */}
    <p>Check out other Projects <a href="http://susheeesh.com/projects">{"-->Here<--"}</a></p>
  </div>
</div>)
}
export default App;