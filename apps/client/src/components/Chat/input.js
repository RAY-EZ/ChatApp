import React,{useState} from 'react';

export default function Input({socket}){
  let [message, setMessage] = useState('');

  const updateMessage = (e)=>{
    // console.log(message)
    setMessage(e.target.value);
  }
  function handleSubmit(e){
    if(message){
      // socket.emit('sendMessage', message, ()=> setMessage(``));
      socket.emit('sendMessage', {message});
    }
    console.log('message sent');
    setMessage('');
    e.preventDefault();
  }

  function enterListener(event){
    if(event.key === 'Enter'){
      handleSubmit(event);
      event.target.value = '';
    }
  }

  return (
    <>
      <div className="chat__area__msg">
          <input type="text" className="chat__area__msg__input" placeholder="Text message" onChange={updateMessage}
            onKeyPress={enterListener}
          />
          <button className="btn chat__area__msg__send" 
          onClick={handleSubmit}>Send</button>
      </div>
    </>
  )
}