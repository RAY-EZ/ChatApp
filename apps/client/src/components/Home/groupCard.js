import React from 'react';

export default function GroupCard({groups}){
  const online = 2;
  const members = 10;

  return (
    groups.map((group)=>{
      return(
      <div className="group__card" 
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
        <div className="group__card__status">
          <div className="group__card__status__online">
            <p>Online</p>
            <p>{online}</p>
          </div>
          <div className="group__card__status__members">
            <p>Members</p>
            <p>{members}</p>
          </div>
        </div>
      </div>
      )
    })
  )
}