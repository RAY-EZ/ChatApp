import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDbContext, useUserContext } from '../../db';
import GroupCard from './groupCard';
import axios from 'axios';

import GroupList from './groupList';

function clearDb(db){
  const tx = db.transaction('groups', 'readwrite');
  let groupStore = tx.objectStore('groups');

  groupStore.clear();
}

export default function Home({ socket:Socket }){
  const {user, setUser} = useUserContext();
  const db = useDbContext();
  const [groupSearch, setGroup] = useState('');
  const [tagSearch, setTag] = useState('');
  const [searchedGroup, setSearchedGroup] = useState([]);
  const [groupid, setGroupid] = useState('');
  const [searchMode, toggleSearch] = useState(false)

  if(Socket.disconnected) {
    Socket.connect();
  }
  
  function handleFocus(e){
    if(e.type === 'focus') toggleSearch(true);
    if(e.target.value.length > 0){
      searchMode || toggleSearch(true)
    }
    if(e.type === 'blur' && e.target.value == 0) toggleSearch(false)
    e.preventDefault();

  }
  function updateState(setMethod){
    return (e)=>{
      setMethod(e.target.value);
    }
  }

  async function handleSearch(e){
    e.preventDefault();
      const url = new URL(`http://${window.location.hostname}:5000`);
      url.pathname = 'group/search'; 
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


  async function handleLogout(){
    const route = `/auth`

    try {
      await axios.post(`${window.location.protocol}//${window.location.hostname}:5000${route}/logout`,{},{withCredentials:true});
      setUser('')
      clearDb(db);
      window.location.reload();
    } catch(e){
      console.log(e)
      // console.log(e.response.data.message)
    }
  }
  return (
    <div className="home-container">
      {groupid && <Navigate to={`/chat/${groupid}`}/>}
      <div className="home__title">
        <h1 className="home__title__greet">
          <span>👋🏼 Welcome </span>
          {user.username}
        </h1>
        <button className="btn btn--clear home__logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="home__group-search">
        <input type="text" className="home__group-search__input" name="group" placeholder="Group Name" onChange={updateState(setGroup)} onBlur={handleFocus} onFocus={handleFocus}/>
        <p className="hash">#</p>
        <input type="text" className="home__group-search__input" name="tag" placeholder="Tag" maxLength={5} onChange={updateState(setTag)} onBlur={handleFocus}/>
        <button className="btn home__group-search__find" onClick={handleSearch}>Find</button>
      </div>
      <GroupList Socket={Socket} setGroupid={setGroupid} searchMode={searchMode} searchedGroup={searchedGroup}/>
    </div>
  )
}