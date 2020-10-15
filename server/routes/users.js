// import required essentials
const express = require('express');
// create new router det kunne lige så godt være alt andet
const router = express.Router();
const user = require('../../Models/user.js');

// "database" med alle vores brugere
let users = [
    new user(1, "Brian", "Johnson", "21")


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


// vi laver et findIndex, for at finde frem til det specifikke punkt i arrayen. 
// 
    let index = users.findIndex(function (user) {
        return user.id === id;
    });

    // opdatering af attribut af det objekt der forfindes på den specifikke plads
    users[index].firstName = firstName;
    users[index].lastName = lastName;
    users[index].age = age;

    res.status(200).json(users[index]);

});

module.exports = router;

// gode noter til en server 

// ctrl + c dræber serveren, eller enhver proces i en terminal
// cd betyder change directory, for at finde frem til servermappen skriver man mappens navn
//npm start skidegodt til Node server.