import React from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../db';
export default function Home(){
  
  const {user} = useUserContext();
  return (
    <div><h1>Logged in as </h1>{user.username}
     <Link to="/chat"> chat </Link>
    </div>
  )
}