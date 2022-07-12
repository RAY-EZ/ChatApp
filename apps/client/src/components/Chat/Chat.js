import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import queryString from 'query-string';
// import io from 'socket.io-client';

// import ChatRoomBar from '../ChatRoom/chatRoom';
import ChatArea from './chatArea';
import ChatHeader from './chatHeader';

import './Chat.css';

const Chat = ({ location, socket }) => {
  // console.log(socket, location);  
  const [view, setView] = useState('chat-view');
  let [message, setMessage] = useState('');

  const updateMessage = (e)=>{
    console.log(message)
    setMessage(e.target.value);
  }
  useEffect(()=>{
    let count = 0;
    console.log('rendered')

    const connectListener = (conn)=>{ 
      // alert(socket.id)
      console.log(conn)
      // window.setTimeout(()=>socket.emit('join'), 3000)
      console.log(socket.id)
    }
    const errorListener = ()=>{

    }
    const joinSuccessListener = ()=>{

    }

    const weclomeListener = (message)=>{
      console.log('\x1b[0;33m%s\x1b[0m',message)
      console.log(count++);
    }

    socket.on('join:success', joinSuccessListener)
    socket.on('error', errorListener)
    socket.on('connect', connectListener)
    socket.on('welcome',weclomeListener)
    
    return ()=>{
      socket.emit('leave');
      socket.off('join:success', joinSuccessListener)
      socket.off('error', errorListener)
      socket.off('connect', connectListener)
      socket.off('welcome', weclomeListener)
    }
  }, []);

  const sendMessage = (event)=>{

  }
  // console.log(messages);
  function handleSubmit(e){
    if(message){
      // socket.emit('sendMessage', message, ()=> setMessage(``));
      socket.emit('sendMessage', message);
    }
    console.log('message sent');
    e.preventDefault();
  }
  return(
    <div className="chat">
      <ChatHeader/>
      <ChatArea updateMessage={updateMessage} handleSubmit={handleSubmit}/>
    </div>
  )
}

export default Chat;