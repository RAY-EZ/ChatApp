import React from 'react';
import ScrollToBottom  from 'react-scroll-to-bottom';

import './Messages.css';
import Message from '../Message/Message'

const ChatMessages= ({messages, name}) => (
        messages.map((message)=> <div><Message message={message} name={name}/></div>)
);

export default ChatMessages;