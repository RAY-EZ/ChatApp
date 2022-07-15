import {Link} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import createURL from '../../utils/createUrl';

export default function ChatHeader({ groupId, socket }){
  // console.log('chat header')
  const [members, setMembers ] = useState(0)   // Later fetch from db
  const [active, setActive] = useState(0); // redis will provide updated value
  const [groupinfo, setGroupinfo] = useState({});
  useEffect(()=>{
    const {hostname, protocol}  = window.location;
    if(groupId){
      const url = new URL(`${protocol}//${hostname}:5000/group/${groupId}`);
      (async ()=>{
        try{
          const response = await axios.get(url.href,{
            withCredentials: true
          })
          // console.log(response)
          const { g_id, id, members, name, total_members} = response.data.data[0];
          setGroupinfo({
            id,
            name,
            g_id,
            total_members
          }) 
        } catch(e){
          console.log(e);
        }

      })();
    }
  },[groupId])

  useEffect(()=>{
    // console.log('socket in header', socket);
    // console.log(typeof window.createURL());
    // console.log(groupinfo.id)
    if(groupinfo.id){      
      let requestUrl = createURL(`/group/${groupinfo.id}/active`);
      // console.log(requestUrl);
      (async ()=>{
        try{
          const response = await axios.get(requestUrl.href,{
            withCredentials: true
          })
          const { activeCount } = response.data

          setActive(activeCount);
        } catch(e){
          console.log(e);
        }
  
      })();
    }
    const activeUserListner = (data)=>{
      setActive(data.members.length);
    }
    socket.on('active:update', activeUserListner)

    return ()=>{
      socket.off('active:update', activeUserListner);
    }
  },[groupinfo])

  return (
    <div className="chat__header">
      <div>
        <div className="chat__info">
          <div className="chat__info__name">{groupinfo.name}</div>
          <div className="chat__info__tag">#{groupinfo.g_id}</div>
        </div>
        <div className="chat__status">
          <p className="chat__status__online">{active} online</p>
          <p className="chat__status__members">{groupinfo.total_members} {groupinfo.total_members > 1? 'members': 'member'}</p>
          <button href="#" className="chat__status__group-details">Show group details</button>
        </div>
      </div>
      <Link to='/' className="chat__close-button">
        <svg className="chat--btn" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><title>close</title><rect x="18.85" y="-4.31" width="2.29" height="48.62" transform="translate(-8.28 20) rotate(-45)"/><rect x="-4.31" y="18.85" width="48.62" height="2.29" transform="translate(-8.28 20) rotate(-45)"/></svg>                 
      </Link>
    </div>
  )
}