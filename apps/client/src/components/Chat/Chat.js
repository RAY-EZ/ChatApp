import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import queryString from 'query-string';
// import io from 'socket.io-client';

// import ChatRoomBar from '../ChatRoom/chatRoom';
import './Chat.css';

// import ChatMessages from '../Messages/Messages';
// import InputMessage from '../Input/Input';


// let socket;
const ChatHeader = ()=>{
  return (
    <div className="chat__header">
      <div>
        <div className="chat__info">
          <div className="chat__info__name">Valorant</div>
          <div className="chat__info__tag">#FL12A</div>
        </div>
        <div className="chat__status">
          <p className="chat__status__online">2 online</p>
          <p className="chat__status__members">50 members</p>
          <button href="#" className="chat__status__group-details">Show group details</button>
        </div>
      </div>
      <Link to='/' className="chat__close-button">
        <svg className="chat--btn" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><title>close</title><rect x="18.85" y="-4.31" width="2.29" height="48.62" transform="translate(-8.28 20) rotate(-45)"/><rect x="-4.31" y="18.85" width="48.62" height="2.29" transform="translate(-8.28 20) rotate(-45)"/></svg>                 
      </Link>
    </div>
  )
}

const ChatArea = ({handleSubmit, updateMessage})=>{

  return (
    <div className="chat__area">
      <div className="chat__area__view">
        {/** Chat View Messages will be here */}
      </div>
      <div className="chat__area__msg">
        <input type="text" className="chat__area__msg__input" placeholder="Text message" onChange={updateMessage}/>
        <button className="btn chat__area__msg__send" onClick={handleSubmit}>Send</button>
      </div>      
    </div>
  )
}
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
    // const {name, room} = queryString.parse(location.search);
    console.log('rendered')
    socket.emit('join');
    const connectListener = (conn)=>{ 
      alert(socket.id)
      console.log(conn)
      // window.setTimeout(()=>socket.emit('join'), 3000)
      console.log(socket.id)
    }
    const weclomeListener = (message)=>{
      console.log('\x1b[0;33m%s\x1b[0m',message)
      console.log(count++);
    }

    socket.on('connect', connectListener)
    socket.on('welcome',weclomeListener)
    
    return ()=>{
      socket.emit('leave');
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