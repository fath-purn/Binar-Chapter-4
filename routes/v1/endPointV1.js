const express = require('express');
const route = express.Router();
const {createUsers, getAllUsers, getUserById} = require('../../handlers/v1/users');
const {createAccount, getAllAccount, getAccountById} = require('../../handlers/v1/accounts');



route.get('/', (req, res) => {
    res.status(200).json({
        status: false,
        message: "Not Found",
        data: null
    })
});

route.post('/user', createUsers);
route.get('/users', getAllUsers);
route.get("/user/:id", getUserById);


// account
route.post('/account', createAccount);
route.get('/accounts', getAllAccount);
route.get("/account/:id", getAccountById);

module.exports = route;