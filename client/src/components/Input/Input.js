import React from 'react';

import './Input.css';

const InputMessage= ({message, setMessage, sendMessage}) => (
    <div className="chat_area-message">
                        <input type="text" className="type" placeholder="Lets Chat 😎😎" 
                        value={message} onChange={(event)=> setMessage(event.target.value)} 
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event): null}
                        />
                        <button className="send" onClick={(event)=> sendMessage(event)}><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs></defs><title>send</title><rect className="cls-1" width="40" height="40"/><polygon points="34.73 15.91 31.49 19.15 22.29 9.94 22.29 38.72 17.71 38.72 17.71 9.94 8.51 19.15 5.27 15.91 19.91 1.28 20 1.37 20.09 1.28 34.73 15.91"/></svg></button>
                    </div>
);

export default InputMessage;