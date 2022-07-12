import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUserContext } from '../../db';
import GroupCard from './groupCard';
import axios from 'axios';

export default function Home({ socket:Socket }){
  const [groupSearch, setGroup] = useState('');
  const [tagSearch, setTag] = useState('');
  const [searchedGroup, setSearchedGroup] = useState([]);
  const [redirect, setRedirection ] = useState(false);
  const [hotfix, setHotfix ] = useState(false);

  useEffect(()=>{
    /** Quick Fix Solve it later using Context */
    console.log(Socket);
    // if(!Socket){
    //   console.log(Socket)
    //   setHotfix(true);
    //   // window.location.reload();
    // }
    return ()=> console.log('home unmounted')
    // setHotfix(true);
  },[])
  function updateState(setMethod){
    return (e)=>{
      setMethod(e.target.value);
    }
  }
  const {user, setUser} = useUserContext();
  const groupList = [];

  const IntialMessage = ()=>{
    return (
      <h2 className="home__initial-message">
        Join a group to start chatting ♥
      </h2>
    )
  }
  async function handleSearch(e){
    e.preventDefault();
      const url = new URL(`http://${window.location.hostname}:5000`);
      url.pathname = 'group';
      if(groupSearch) url.searchParams.append('name',groupSearch)
      if(tagSearch) url.searchParams.append('g_id',tagSearch.toUpperCase())
      try{
        if(!groupSearch && !tagSearch) return;
        const response = await axios.get(url.href,
        {
          withCredentials: true  
        })
        setSearchedGroup(response.data);
      }catch(e){
        // console.log(e)
        console.log(e.response.data.message)
        // messageRef.innerHTML = e.response.data.message;
      }
  }

  function handleJoin(event){
    const Group = event.target.closest('.group__card');
    if(!Group) return; // null - no group selected
    const GroupId = Group.dataset.groupId;
    if(!GroupId) return; // undefined
    const Groupinfo = {
      name: Group.dataset.groupName,
      id: Group.dataset.groupId,
      g_id: Group.dataset.g_id
    }
    Socket.emit('join', Groupinfo );
    setRedirection(true);
    
  }

  async function handleLogout(){
    const route = `/auth`

    try {
      console.log(`${window.location.protocol}//${window.location.hostname}:5000${route}/logout`)
      await axios.post(`${window.location.protocol}//${window.location.hostname}:5000${route}/logout`,{},{withCredentials:true});
      setUser('')
      window.location.reload();
    } catch(e){
      console.log(e.response.data.message)
    }
  }
  return (
    <div className="home-container">
      {redirect && <Navigate to="/chat"/>}
      {hotfix && <Navigate to="/" />}
      <div className="home__title">
        <h1 className="home__title__greet">
          <span>👋🏼 Welcome </span>
          {user.username}
        </h1>
        <button className="btn btn--clear home__logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="home__group-search">
        <input type="text" className="home__group-search__input" name="group" placeholder="Group Name" onChange={updateState(setGroup)}/>
        <p className="hash">#</p>
        <input type="text" className="home__group-search__input" name="tag" placeholder="Tag" maxLength={5} onChange={updateState(setTag)}/>
        <button className="btn home__group-search__find" onClick={handleSearch}>Find</button>
      </div>
      <Link to="/chat">Chat</Link>
      <div className="home__group-list" onClick={handleJoin}>
        {(groupList.length === 0 && searchedGroup.length ===0) && <IntialMessage/>}
        <GroupCard groups={searchedGroup.length > 0 ? searchedGroup: groupList}/> 
  
      </div>
    </div>
  )
}