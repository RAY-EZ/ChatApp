const users = [];

export const addUser = ({ id, name, room})=>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user)=> user.room === room && user.name === name);

    if(existingUser){
        return { error: 'Username is taken'};
    }

    const user = { id, name, room};
    users.push(user);
    // console.log(user);
    return {user};
}

export const removeUser = (id)=>{
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1);
    }
}

export const getUser = (id)=> users.find(user => user.id === id);


export const getUserInRoom = (room)=> users.filter(user => user.room === room);