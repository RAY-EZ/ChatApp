import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChatArea from './chatArea';
import ChatHeader from './chatHeader';

import './Chat.css';

const Chat = ({ location, socket}) => {

  let {groupid} = useParams();

  // console.log('chat :',groupid);
  // console.log('chat: ', socket);  
  const [view, setView] = useState('chat-view');
  let [ render , setRender] = useState(false);

  let [groupId, setGroupId] = useState('');


  useEffect(()=>{
    // socket.emit('join', group);
    let count = 0;
    // console.log('rendered')

    const connectListener = (conn)=>{ 
      // alert(socket.id)
      // window.setTimeout(()=>socket.emit('join'), 3000)
      // console.log(socket.id)
    }
    const errorListener = ()=>{

    }

    const weclomeListener = (message)=>{
      console.log('\x1b[0;33m%s\x1b[0m',message)
      // console.log(count++);
    }

    const userLeftListener = (userInfo)=>{
      console.log(userInfo.userName, ' has left');
    }



    const newUserListener = (userInfo) =>{
      console.log(userInfo.userName, ' has joined')
    }


    socket.on('user:join', newUserListener)
    socket.on('user:left', userLeftListener)
    socket.on('error', errorListener)
    socket.on('connect', connectListener)
    socket.on('welcome',weclomeListener)

    
    return ()=>{
      socket.emit('leave');

      socket.off('user:join', newUserListener);
      socket.off('user:left', userLeftListener);
      socket.off('error', errorListener);
      socket.off('connect', connectListener);
      socket.off('welcome', weclomeListener);
    }
  }, []);

  const sendMessage = (event)=>{

  }

  // console.log(messages);

  return(
    <div className="chat">
      <ChatHeader groupId={groupid} socket={socket}/>
      <ChatArea socket={socket}/>
    </div>
  )
}

export default Chat;