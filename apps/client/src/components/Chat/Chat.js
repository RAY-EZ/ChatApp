import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import ChatRoomBar from '../ChatRoom/chatRoom';
import './Chat.css';

import ChatMessages from '../Messages/Messages';
import InputMessage from '../Input/Input';


let socket;
const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const EndPoint = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(EndPoint)
        setName(name);
        setRoom(room);
        // Params : first is the event , second is the data we we want to pass, 
        //third is callback for error handling stuff 
        socket.emit('join',{name,room}, ()=>{}
        );
        
        return ()=>{
            // Emitting event name should be same on server side 
            socket.emit('disconnet');
            
            socket.off();
        }
    }, [EndPoint, location.search]);

    useEffect(()=> {
        socket.on('message', (message)=>{
            setMessages([...messages, message]);
        }, [messages]);
    });

    const sendMessage = (event)=>{
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(``));
        }
        event.preventDefault();
    }
    console.log(messages);
    return(
        <div className="main">
            <div className="chat">
                <ChatRoomBar room={room}/>
                <div className="chat_area">
                    <div className="chat_area-view">
                    <ChatMessages messages={messages} name={name}/>
                    </div>
                </div>
                
                <InputMessage message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    )
}

export default Chat;