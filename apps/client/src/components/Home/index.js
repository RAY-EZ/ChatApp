import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useUserContext } from '../../db';
import GroupCard from './groupCard';
import axios from 'axios';
import { useDbContext } from '../../db';
import createUrl from '../../utils/createUrl';

async function getAllGroups(db){
  let tx = db.transaction('groups', 'readonly');
  let groupStore = tx.objectStore('groups')

  const groups = await groupStore.getAll();
  return groups;
} 
/**
 * 
 * @param {object} db  - indexed db instance
 * @param {array} groupList - array of group object
 */
async function pushGroupIntoDB(db, groupList){
  let tx = db.transaction('groups', 'readwrite');
  let groupStore = tx.objectStore('groups');

  for(let i=0; i< groupList.length; i++){
    const groups = await groupStore.add(groupList[i]);
  }
}

/**
 * 
 * @param {string} groupid - unique group identifier
 * @param {number} active - active members
 * @param {number} members - total members
 */
function updateGroupStatus(groupid, active, members ){
  const activeElement = document.querySelector(`[data-group-id="${groupid}"] .group__card__status__online`);
  /** Fix it later */
  if(!activeElement) return;
  activeElement.innerHTML = `<p>Online</p><p>${active}</p>`
}

export default function Home({ socket:Socket }){
  const {user, setUser} = useUserContext();
  const db = useDbContext();
  const [groupSearch, setGroup] = useState('');
  const [tagSearch, setTag] = useState('');
  const [searchedGroup, setSearchedGroup] = useState([]);
  const [groupid, setGroupid] = useState('');
  const [searchMode, toggleSearch] = useState(false)
  const [groupList, updateGroupList] = useState([]);

  // console.log('rerender');
  useEffect(()=>{
    /** Quick Fix Solve it later using Context */
    // console.log(Socket);
    // console.log(db);
    (async ()=>{
      try {
        let groups = await getAllGroups(db);
        if(groups.length === 0){
          let url = createUrl('/group/');
          const response = await axios.get(url.href,{
            withCredentials: true
          })
          groups = response.data.data
          await pushGroupIntoDB(db, groups); 
        }
        updateGroupList(groups)
      } catch(e){
        console.log(e)
      }
    })()
    
    // return ()=> console.log('home unmounted')
    // setHotfix(true);
  },[])

  useEffect(()=>{
    function activeUpdate(data){
      updateGroupStatus(data.groupId, data.activeCount, 10)
    }
    Socket.on('active:update',activeUpdate)
    // Socket.on('shit', (shit)=>{
    //   console.log(shit);
    // })
    // console.log(Socket)
    return ()=>{
      Socket.off('active:update', activeUpdate);
    }
  },[])
  
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
    setGroupid(Groupinfo.id);
    
  }

  async function handleLogout(){
    const route = `/auth`

    try {
      await axios.post(`${window.location.protocol}//${window.location.hostname}:5000${route}/logout`,{},{withCredentials:true});
      setUser('')
      window.location.reload();
    } catch(e){
      console.log(e.response.data.message)
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
      <div className="home__group-list" onClick={handleJoin}>
        {(groupList.length === 0 && searchedGroup.length ===0) && <IntialMessage/>}
        <GroupCard groups={
          (searchedGroup.length > 0 && searchMode) ? 
          searchedGroup: groupList
          }/> 
  
      </div>
    </div>
  )
}