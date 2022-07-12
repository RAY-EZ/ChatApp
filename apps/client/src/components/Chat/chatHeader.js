import {Link} from 'react-router-dom';
import React from 'react';

export default function ChatHeader(){
  return (
    <div className="chat__header">
      <div>
        <div className="chat__info">
          <div className="chat__info__name">Valorant</div>
          <div className="chat__info__tag">#FL12A</div>
        </div>
        <div className="chat__status">
          <p className="chat__status__online">2 online</p>
          <p className="chat__status__members">50 members</p>
          <button href="#" className="chat__status__group-details">Show group details</button>
        </div>
      </div>
      <Link to='/' className="chat__close-button">
        <svg className="chat--btn" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><title>close</title><rect x="18.85" y="-4.31" width="2.29" height="48.62" transform="translate(-8.28 20) rotate(-45)"/><rect x="-4.31" y="18.85" width="48.62" height="2.29" transform="translate(-8.28 20) rotate(-45)"/></svg>                 
      </Link>
    </div>
  )
}