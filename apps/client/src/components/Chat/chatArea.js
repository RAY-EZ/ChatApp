import React from 'react';

export default function ChatArea ({handleSubmit, updateMessage}){

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