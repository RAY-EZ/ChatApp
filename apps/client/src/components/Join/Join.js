import React, {useState, createRef} from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';

import './Join.css';
import { useUserContext } from '../../db';

const Join = () => {
  console.log('rerender')

    let {user, setUser} = useUserContext();
    let messageRef= createRef();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [formType, setFormType] = useState('login');

    function handleChange(setter){
      return (event)=>{
        setter(event.target.value);
      }
    }

    function handleFormType(e){
      setFormType(formType == 'login'? 'signup' : 'login')
      e.preventDefault();
    }

    async function handleSubmit(e){
      e.preventDefault();
      const signupUri = '/user/signup';
      const loginUri = '/auth/login';
      const uri = formType === 'login' ? loginUri : signupUri;
      
      try{
        const response = await axios.post(`http://localhost:5000${uri}`,{
            password,
            username: name
        },{
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          withCredentials: true  
        })

        if(formType == 'signup'){
          window.location.href = 'http://localhost:3000/'
        }
        // window.localStorage.setItem('user', response.data.user);
        setUser(response.data.user);
      }catch(e){
        // console.log(e)
        console.log(e.response.data.message)
        messageRef.innerHTML = e.response.data.message;
      }

      // console.log(response)
    }
    return(
    <div className="fake-wrapper">
          <div className="wrapper">
              <h1 className="header-primary">{
                formType == 'login'?
                'Login':
                'Sign Up'
              }</h1>
              <div className="prompt__error">
                <p className="prompt__error__message" ref={(err)=>messageRef = err}>
                </p>
              </div>
              <form className="form" onSubmit={handleSubmit}>
                  <div className="form_group">
                      <input type="text" id="name" placeholder="Username" onChange={handleChange(setName)} />
                      <label htmlFor="name">Username</label>
                  </div>
                  <div className="form_group">
                      <input type="text" id="password" placeholder="Password" onChange={(event)=> setPassword(event.target.value)} />
                      <label htmlFor="password">Password</label>
                  </div>
                  {
                    formType !== 'login'?
                    <div className="form_group">
                        <input type="text" id="confirm-password" placeholder="Confirm Password" onChange={(event)=> setconfirmPassword(event.target.value)} />
                        <label htmlFor="confirm-password">Confirm password</label>
                    </div>
                    : null
                  }
                  <div className="form_group shadow">
                  <input type="submit" className="btn" value={formType === 'login' ? 'Login': 'Sign Up'}/>
                  </div>
              </form>

              <a href=" " className="login__instead" onClick={handleFormType}>
                {
                  formType === 'login'?
                  "New user? Sign Up"
                  : 
                  "Already user? login instead"
                }
              </a>
          </div>
      </div>
    )
}

export default Join;

{/* <div className="form_group">
<input type="text" id="group" placeholder="Group Name" onChange={(event)=> setRoom(event.target.value)}/>
<label htmlFor="group">Group Name</label>
</div> */}
