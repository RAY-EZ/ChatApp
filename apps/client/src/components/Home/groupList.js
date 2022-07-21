import React,{ useState, useEffect } from 'react';
import GroupCard from './groupCard';
import { useDbContext } from '../../db';
import createUrl from '../../utils/createUrl';
import axios from 'axios';
import CreateGroupDialog from './createGroupDialog';

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

export default function GroupList({ Socket, setGroupid, searchMode, searchedGroup }){
  const db = useDbContext();
  const [groupList, updateGroupList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(()=>{
    /** Quick Fix Solve it later using Context */
    // console.log(Socket);
    // console.log(db);
    (async ()=>{
      try {
        let groups = await getAllGroups(db);
        // fetching from server
        if(groups.length === 0){
          let url = createUrl('/group/');
          const response = await axios.get(url.href,{
            withCredentials: true
          })
          groups = response.data.data
          await pushGroupIntoDB(db, groups); 
        }
        // updating group list
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


async function handleJoin(event){
  const Group = event.target.closest('.group__card');
  event.persist();
  if(!Group) return; // null - no group selected
  const GroupId = Group.dataset.groupId;
  if(Group.classList.contains('group__card--flat')){
    try {
      let url = createUrl(`/group/${GroupId}/join`);
      let response =await axios.post(url.href, {}, { withCredentials: true});
      console.log(response);
    } catch(e){
      // handling errors 
      console.log(e);
    }
  }
    if(!GroupId) return; // undefined
    const Groupinfo = {
      name: Group.dataset.groupName,
      id: Group.dataset.groupId,
      g_id: Group.dataset.g_id
    }
    Socket.emit('join', Groupinfo );
    setGroupid(Groupinfo.id);
    
  }

  const toggleShowMadal = (e)=>{
    console.log("event child")
    showModal ? setShowModal(false) : setShowModal(true);
  }

  const IntialMessage = ()=>{
    return (
      <>
      <div className="home__initial">
        <h2 className="home__initial__message">
          Join a group to start chatting ♥
        </h2>
        <button className="btn home__initial__create-group" onClick={toggleShowMadal}>Create Group</button>
      </div>
      </>
    )
  }
  
  return (
    <>
      <div className="home__group-list" onClick={handleJoin}>
        {(groupList.length === 0 && !searchMode) && <IntialMessage/>}
        {showModal && <CreateGroupDialog toggleModal={toggleShowMadal} />}
        {(groupList.length !== 0 && !searchMode) &&         
          <GroupCard 
            groups={ groupList}
            toggleModal={toggleShowMadal}
            /> 
        }
        {(searchMode && searchedGroup.length >= 0) &&         
          <GroupCard 
            groups={ searchedGroup}
            toggleModal={toggleShowMadal}
            /> 
        }
      </div>
    </>
  )
}
