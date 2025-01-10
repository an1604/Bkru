class User{
    constructor(email, username,password,longitude,latitude){
        this.email = email;
        this.username = username;
        this.id =  Math.random().toString(36).substring(2, 9);;
        this.password = password;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
}

module.exports = User;