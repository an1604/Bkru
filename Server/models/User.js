class User{
    constructor(email, username,password){
        this.email = email;
        this.username = username;
        this.id =  Math.random().toString(36).substring(2, 9);;
        this.password = password;
    }
    
}

module.exports = User;