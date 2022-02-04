const c_users = [];

//Join user to specific chat room
function join_User(id, username, room){
    const p_user = {id, username, room};
    c_user.push(p_user);
    console.log(c_users, "users");
    return p_user;
}

console.log("user Out", c_users);

//Gets a particular user Id to return  the current user
function get_Current_User(id){
    return c_users.find((p_user) => p_user.id === id);
}

// called  when the user leaves the chat  and its object deleted from array
function user_Disconnect(id){
    const index =  c_users.find((p_user) => p_user.id === id);
    if(index !== -1){
        return c_users.splice(index, 1)[0];
    }
}

module.exports = {
    join_User,
    get_Current_User,
    user_Disconnect
};