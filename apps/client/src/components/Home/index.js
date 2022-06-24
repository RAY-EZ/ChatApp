import React from 'react';

import { useUserContext } from '../../db';
export default function Home(){
  
  const {user} = useUserContext();
  return (
    <div><h1>Logged in as </h1>{user.username}</div>
  )
}