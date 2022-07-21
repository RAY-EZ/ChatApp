import React from 'react';
import add from './SVG/add.svg';
import { useUserContext } from '../../db';
export default function GroupCard({groups, toggleModal}){
  const {user} = useUserContext();
  const online = 0;
  const members = 10;

  return (
    <>
      {/** for creating new group */}
      <div className="group__card" 
        tabIndex={0} 
        onClick={toggleModal}
      >
      <div className="group__card__create">
        <img src={add} alt="add" />
        Create New Group
      </div>
      </div>

      {/** Group list */}
      {groups.map((group)=>{
        return(
        <div className={["group__card", `${group.isMember == false? 'group__card--flat': ''}`].join(' ')}
          tabIndex={0} 
          key={group.id} 
          data-group-id={group.id} 
          data-g_id={group.g_id}
          data-group-name={group.name}
          >
          <div className="group__card__info">
            <div className="group__card__title">{group.name}</div>
            <div className="group__card__tag">#{group.g_id}</div>
          </div>
          {
            group.isMember || group.isMember == undefined?  
            (<div className="group__card__status">
              <div className="group__card__status__online">
                <p>Online</p>
                <p>{online}</p>
              </div>
              <div className="group__card__status__members">
                <p>Members</p>
                <p>{group.total_members}</p>
              </div>
            </div>)
            :  // if not member
            <div className="group__card__status">
             <button className="btn group__card__join">Join</button>
            </div>
            
          }
        </div>
        )
      })}

    </>
  )
}