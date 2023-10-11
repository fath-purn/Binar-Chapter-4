const express = require('express');
const route = express.Router();
const {createUsers, getAllUsers, getUserById} = require('../../handlers/v1/users');
const {createAccount, getAllAccount, getAccountById} = require('../../handlers/v1/accounts');
const {createTransactions, getAllTransactions, getTransactionsById} = require('../../handlers/v1/transactions');


route.get('/', (req, res) => {
    res.status(200).json({
        status: false,
        message: "Not Found",
        data: null
    })
});

// users
route.post('/users', createUsers);
route.get('/users', getAllUsers);
route.get("/users/:id", getUserById);

// account
route.post('/accounts', createAccount);
route.get('/accounts', getAllAccount);
route.get("/accounts/:id", getAccountById);


// transactions
route.post('/transactions', createTransactions);
route.get('/transactions', getAllTransactions);
route.get("/transactions/:id", getTransactionsById);

module.exports = route;