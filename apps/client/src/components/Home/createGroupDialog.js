import React, { useEffect, useState } from 'react';
import ReactDOM  from 'react-dom';
import Modal from '../../utils/modal';
import axios from 'axios';
import { Navigate } from 'react-router-dom'
import createURL from '../../utils/createUrl';

const modalRoot = document.getElementById('modal-root');

function Form(){
  const [groupName, setGroupName] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [group, setGroup] = useState(null) // after successfully creating group
  async function createGroup(e){
    e.preventDefault();
  console.log(groupName, isProtected)
    const url = new createURL(`/group/create`);
    try{
      if(!groupName && isProtected != undefined) return;
      const response = await axios.post(url.href,
        {
          name: groupName,
          isProtected
        },
      {
        withCredentials: true  
      })
      const group = response.data.data[0];
      setGroup(group);
      console.log(response.data);
    }catch(e){
      // console.log(e)
      console.log(e.response.data.message)
      // messageRef.innerHTML = e.response.data.message;
    }
  }
  return (
    <div className="dialog-wrapper">
      {group && <Navigate to={`/chat/${group.id}`}/>}
        <div>
          <input type="text" 
            className="create-group__name" 
            id="group-name" 
            placeholder='Group Name' 
            onChange={(e)=>{
              e.persist();
              setGroupName(e.target.value)
            } 
          }/>
          <label htmlFor="group-name">Group Name</label>
        </div>
        <div>
          <input 
            type="checkbox" 
            id="isprotected" 
            name="isProtected" 
            className='create-group__protected'
            onChange={(e)=> setIsProtected(e.target.checked)}/>
          <label htmlFor="isprotected">Protected Group</label>
        </div>

        <button className="btn create-group__button" onClick={createGroup}>Done</button>
      </div>
  )
}
export default function CreateGroupDialog({ toggleModal }){
  return (
    <Modal toggleModal={toggleModal} className="dialog">
      <Form/>
    </Modal>
  )
}