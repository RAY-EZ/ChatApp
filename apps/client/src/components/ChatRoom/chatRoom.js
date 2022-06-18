import React from 'react';

import './chatRoom.css';

const ChatRoomBar= ({room}) => (
    <div className="chat_room">
                    <div className="chat_room_info">
                        <div className="room-state"></div>
<h2 className="room-name">{room}</h2>
                    </div> 
                    <div className="chat_room_control">
                        <div className="minimize">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs></defs><title>minimize</title><rect className="cls-1" width="40" height="40"/><rect x="4" y="18.5" width="32" height="3"/></svg>
                        </div>
                        <div className="maximize">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs></defs><title>maximize</title><rect className="cls-1" width="40" height="40"/><path id="maximize" d="M38,38H2V2H38ZM4.77,35.23H35.23V4.77H4.77Z"/></svg>
                        </div>
                        <div className="close">
                            <a href="/"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs></defs><title>close</title><rect className="cls-1" width="40" height="40"/><rect x="18.85" y="-4.31" width="2.29" height="48.62" transform="translate(-8.28 20) rotate(-45)"/><rect x="-4.31" y="18.85" width="48.62" height="2.29" transform="translate(-8.28 20) rotate(-45)"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
);

export default ChatRoomBar;