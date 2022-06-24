import React,{useState ,useContext, createContext, useEffect} from 'react';
import * as idb from 'idb';

const dbContext = createContext();
const userContext = createContext({
  user: null,
  setUser: ()=>{}
});

function getSavedValue(key, initialValue){
  const savedValue = JSON.parse(window.localStorage.getItem(key));
  if(savedValue) return savedValue;

  if(Object.prototype.toString.call(initialValue)== '[object Function]'){
    return initialValue();
  }
  return initialValue;
}

export function useLocalStorage(key, initialValue){
  const [value, setValue] = useState(()=> getSavedValue(key, initialValue));

  useEffect(()=>{
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value,setValue];
}


export const DbContext = ({children})=>{
  // Opening an idb
  // Will contain Groups and User info
  const [db, setdb]= useState(null);
  const [user, setUser] = useLocalStorage('user',null);
  const userContextVal = { user, setUser };

  useEffect(()=>{
    (async ()=>{
      const db = await idb.openDB('chat_app', 1, (db)=>{
        db.createObjectStore('groups', {keyPath: 'g_id'})
      })
      setdb(db);
    })()
  },[])

  return (
    <dbContext.Provider value={db}>
      <userContext.Provider value={userContextVal}>
        {children}
      </userContext.Provider>
    </dbContext.Provider>
  )
}

export const useDbContext = ()=> useContext(dbContext);
export const useUserContext = ()=> useContext(userContext);