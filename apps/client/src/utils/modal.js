import React, { useEffect } from 'react';
import ReactDOM  from 'react-dom';

const modalRoot = document.getElementById('modal-root');

export default function Modal({ toggleModal, className, ...props}){
  function clickHandler (e){
    if(e.target === this){
      toggleModal();
    }
    // toggleModal()
  }
  const element = document.createElement('div');
  element.className = className;
  element.onclick = clickHandler
  useEffect(()=>{
    modalRoot.append(element)

    return ()=>{
      modalRoot.removeChild(element)
    }
  },[])
  return ReactDOM.createPortal(props.children, element)
}