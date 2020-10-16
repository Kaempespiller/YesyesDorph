// import required essentials
const express = require('express');
// create new router det kunne lige så godt være alt andet
const router = express.Router();
const user = require('../../Models/user.js');
const jwt = require('jsonwebtoken');
const fs = require('fs')

// "database" med alle vores brugere
let users = [
    new user(1, "Brian", "Johnson", "21", "Hvalen@julen.dk", "123456"),

];
// nu kan vi læse data ud fra en given brugen ud fra et id.
router.get('/read/:id', function(req, res) {
        // find an object from `data` array match by `id`
        let found = users.find(function (user) {
            return user.id === parseInt(req.params.id);
        });
        // if object found return an object else return 404 not-found
        if (found) {
            res.status(200).json(found);
        } else {
            res.sendStatus(404);
        }
});
// this end-point of an API returns JSON data array
router.get('/', function (req, res) {
    res.status(200).json(users);
});

// query den sjovert oppe i URL'en efter spørgsmålstegnet
router.get('/create', function (req,res){ 
        let firstName = req.query.firstName;
        let lastName = req.query.lastName;
        let age = parseInt(req.query.age);
        let email = req.query.email;
        let password = req.query.password;
// newId laver det næste unikke id til den næste bruger
            let newId = users.length+1;
        let newUser = new user(newId, firstName, lastName, age)

        users.push(newUser)
            res.status(200).json(newUser);

});


//update funktion
router.get('/update', function(req,res) {
    let id = parseInt(req.query.id);
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    let age = parseInt(req.query.age);
    let email = req.query.email;
    let password = req.query.password;


// vi laver et findIndex, for at finde frem til det specifikke punkt i arrayen. 
// 
    let index = users.findIndex(function (user) {
        return user.id === id;
    });

    // opdatering af attribut af det objekt der forfindes på den specifikke plads
    // ?? betyder hvis brugeren har 'glemt' at udfylde sit fx firstName, så bruger den bare 
    // firstNamet fra før
    users[index].firstName = firstName ? firstName : users[index].firstName;
    users[index].lastName = lastName ? lastName : users[index].lastName;
    users[index].age = age ? age : users[index].age;
    users[index].email = email ? email : users[index].email;
    users[index].password = password ? password : users[index].password;

    res.status(200).json(users[index]);

});
// router henviser til const routeren som det også hedder, get bruges til at hente dataen 
router.get('/delete', function(req,res) {
        let id = parseInt(req.query.id);
    
        let index = users.findIndex(function (user) {
            return user.id === id;
        });
// splice benytter jeg til at fjerne et objekt fyldt med data fra user arrayet
// splice = remove, bare med mulighed for at gemme det slettede data
        let deletedUser = users.splice(index, 1);
        console.log(deletedUser);
        res.status(200).json(deletedUser[0]);
        

} );


// login funktion
router.get('/login', function(req,res){
    let email = req.query.email;
    let password = req.query.password;

    let user = users.find(function (user) {
        return user.email === email && user.password === password;
    });
    if (!user) {
         res.status(400).send("Jeg er så glad for min penis")
         return;
    } 
// ../../ de der punktummer udgør ligesom hvor mappen er henne. 2 (../) dobbelt punktummer betyder mappen ovenover
    let privateKey = fs.readFileSync('../private.pem', 'utf8');
    let token = jwt.sign({ "id": user.id }, "YeetSkeetDeetDuupJorgen", { algorithm: 'HS256'});

    res.status(200).send(token);

    // hallo token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjAyODExOTU3fQ.rlN2Q2HhgqqvLcZY31IgqIbJB4QR1zarh_FFXvdMh60
});
      


// Jesen
// let privateKey = fs.readFileSync('./private.pem', 'utf8');
// let token = jwt.sign({ "body": "stuff" }, "MySuperSecretPassPhrase", { algorithm: 'HS256'});

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync('../private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized1" });
                throw new Error("Not Authorized1");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        res.status(500).json({ error: "Not Authorized2" });
        throw new Error("Not Authorized2");
    }
}
router.get('/secret', isAuthenticated, function (req, res){
    res.json({ "message" : "THIS IS SUPER SECRET, DO NOT SHARE!" })
})
        
    



module.exports = router;

// gode noter til en server 

// ctrl + c dræber serveren, eller enhver proces i en terminal
// cd betyder change directory, for at finde frem til servermappen skriver man mappens navn
//npm start skidegodt til Node server.