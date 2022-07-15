import React from 'react';
import {Link } from 'react-router-dom'

export default function NoMatch(){
  return (
    <div className="nomatch">
      <h1 className="nomatch__message">
        Are You Lost?
      </h1>
      <Link to='/' className='btn nomatch__button'>No, Take me back!</Link>
    </div>
  )
}