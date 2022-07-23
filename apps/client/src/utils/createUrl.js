// import React from 'react';


/**
 * @params {string} base - the target resource you are querying or requesting
 * 
 */
function createURL(base, protocol){
  const Hostname = window.location.hostname;
  const Protocol = protocol != undefined ? protocol: 'http:';
  const Port = '5000';
  if(base.match(/^\//)){
    base = base.slice(1);
  }
  return new URL(`${Protocol}//${Hostname}:${Port}/${base}`);
}

export default createURL;