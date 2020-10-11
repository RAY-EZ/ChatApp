import React, {useState} from 'react';
import { Link } from 'react-router-dom';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return(
    <div className="fake-wrapper">
          <div className="wrapper">
              <h1 className="header-primary">Join Chat</h1>
              <div className="form">
                  <div className="form_group">
                      <input type="text" id="name" placeholder="Display Name" onChange={(event)=> setName(event.target.value)} />
                      <label htmlFor="name">Display Name</label>
                  </div>
                  <div className="form_group">
                      <input type="text" id="group" placeholder="Group Name" onChange={(event)=> setRoom(event.target.value)}/>
                      <label htmlFor="group">Group Name</label>
                  </div>
                  <div className="form_group shadow">
                  <Link onClick={event => (!name || !room) ? event.preventDefault(): null} to={`/chat?name=${name}&room=${room}`}>
                    <button type="submit" className="btn" value="Join In">Join In</button>
                  </Link>
                  </div>
              </div>
          </div>
      </div>
    )
}

export default Join;

{/* 
<div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Create Room</h1>
                <div><input placeholder="Your display name..." className="joinInput" type="text" onChange={(event)=> setName(event.target.value)} /></div>
                <div><input placeholder="Room unique name..." className="joinInput mt-20" type="text" onChange={(event)=> setRoom(event.target.value)} /></div>
                <Link onClick={event => (!name || !room) ? event.preventDefault(): null} to={`/chat?name=${name}&room=${room}`}>
                    <button className="button mt-20" type="submit">Join In</button>
                </Link>
            </div>
    </div> */}