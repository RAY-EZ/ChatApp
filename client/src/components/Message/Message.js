import React, { useReducer } from 'react';

import './Message.css';

const Message = ({ message:{ user, text}, name}) =>{
    let sentByCurrUser = false;

    const trimmedName = name.trim().toLowerCase();
    if(user === trimmedName){
        sentByCurrUser = true;
    }

    return(
        sentByCurrUser?
        (
            <div className="user-right user-right_text">
                <div className="name"><p>{trimmedName}</p></div>
                <div className="message"><p>{text}</p></div>
            </div>
        ):(
            <div className="user-left user-left_text">
                <div className="name"><p>{user}</p></div>
                <div className="message"><p>{text}</p></div>
            </div>
        )
    )
}

export default Message;