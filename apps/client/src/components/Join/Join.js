import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Join.css';

const Join = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    function handleChange(setter){
      return (event)=>{
        setter(event.target.value);
      }
    }

    function handleSubmit(e){
      // const uri = window.location.
      axios.post('http://localhost:5000/user/signup',{
          name,
          password,
          username: name
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(console.log)
      // console.log(uri)
      e.preventDefault();
    }
    return(
    <div className="fake-wrapper">
          <div className="wrapper">
              <h1 className="header-primary">Join Chat</h1>
              <form className="form" onSubmit={handleSubmit}>
                  <div className="form_group">
                      <input type="text" id="name" placeholder="Username" onChange={handleChange(setName)} />
                      <label htmlFor="name">Username</label>
                  </div>
                  <div className="form_group">
                      <input type="text" id="password" placeholder="Password" onChange={(event)=> setPassword(event.target.value)} />
                      <label htmlFor="password">Password</label>
                  </div>
                  <div className="form_group">
                      <input type="text" id="confirm-password" placeholder="Confirm Password" onChange={(event)=> setconfirmPassword(event.target.value)} />
                      <label htmlFor="confirm-password">Confirm password</label>
                  </div>
                  <div className="form_group shadow">
                  <input type="submit" className="btn" value="submit"/>
                  </div>
              </form>
          </div>
      </div>
    )
}

export default Join;

{/* <div className="form_group">
<input type="text" id="group" placeholder="Group Name" onChange={(event)=> setRoom(event.target.value)}/>
<label htmlFor="group">Group Name</label>
</div> */}
