class user {
    constructor (id, firstName, lastName, age, email, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.email = email;
        this.password = password;


    }
    
}

module.exports = user;


class userPayment extends user {
    constructor (firstName, lastName, age, ) {
    super (firstName, lastName, age)
    
    }
}

class userFree extends user {
    constructor (firstName, lastName, age, ) {
        super (firstName, lastName, age)
    

    }
}


class img {

}
