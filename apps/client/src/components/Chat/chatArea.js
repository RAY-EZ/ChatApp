import React, {useEffect, useState} from 'react';
import Input from './input';

/// Initial tought -
// 1. storing all message in key-val pair 
// 2. storing messages only while user
// 3. storing messages as key-val[] and update message in background even user leaves

// approach 2 for now
function appendMessage({message, sender},to){
  let chatArea = document.querySelector('.chat__area__view')
  chatArea.insertAdjacentHTML('beforeend',
   `<div class="chat__area__message message--${to}">
   <div class="message__container">
     <div class="message__sender">
         <p class="message__sender__name">${sender == undefined ? 'You': sender.userName }</p>
       </div>
       <div class="message__text">
         ${message}
       </div>
   </div>
 </div>`)
  chatArea.scrollTo(0,chatArea.scrollHeight);
}
export default function ChatArea ({socket}){
  useEffect(()=>{
    const messageAcknowledgment = (ack)=>{
      // console.log("acknowlegement", ack)
      appendMessage(ack,"self");
    }
    const incomingMessageListener = (msg)=>{
      // console.log(msg);
      // console.log(msg.message, ' from ', msg.sender.userName);
      appendMessage(msg, "other")
    }
    socket.on('message:ack',messageAcknowledgment);
    socket.on('message',incomingMessageListener);
    return ()=>{
      socket.off('message',incomingMessageListener);
      socket.off('message:ack',messageAcknowledgment)
    }
  })
  // console.log('chat area')
  return (
    <div className="chat__area">
      <div className="chat__area__view">
        {/** Chat View Messages will be here */}
        
      </div>
      <Input socket={socket}/>      
    </div>
  )
}

/*

<div className="chat__area__message message--other">
          <div className="message__container">
            <div className="message__sender">
              <p className="message__sender__name">Luffy</p>
            </div>
            <div className="message__text">
              Hey! guys lets go to cake island. It will be fun.
            </div>
          </div>
        </div>
        <div className="chat__area__message message--self">
          <div className="message__container">
            <div className="message__sender">
                <p className="message__sender__name">Nami</p>
              </div>
              <div className="message__text">
                No no no... ahh hahh 😭😭😭😭😭
              </div>
          </div>
        </div>
        <div className="chat__area__message message--other">
          <div className="message__container">
            <div className="message__sender">
              <p className="message__sender__name">God D. Usopp</p>
            </div>
            <div className="message__text">
              Cho-- chotto Maate Luffy.
            </div>
          </div>
        </div>
        <div className="chat__area__message message--other">
          <div className="message__container">
            <div className="message__sender">
              <p className="message__sender__name">God D. Usopp</p>
            </div>
            <div className="message__text">
              Nami he's gone.
            </div>
          </div>
        </div>
        <div className="chat__area__message message--other">
          <div className="message__container">
            <div className="message__sender">
              <p className="message__sender__name">Tony_Tony_Chopper</p>
            </div>
            <div className="message__text">
              Usopp it's cotton candy that is falling nom nom.. 🤤 sugoi sugoi 🤩😍🍬 nom nom-mh mh
            </div>
          </div>
        </div>


        <div className="chat__area__event">
          <p className="event__message">
            Luffy left
          </p>
        </div>
*/