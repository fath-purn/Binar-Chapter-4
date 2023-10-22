const express = require('express');
const route = express.Router();
const {register, login, authenticate, getAllUsers, getUserById} = require('../../handlers/v1/users');
const {createAccount, getAllAccount, getAccountById} = require('../../handlers/v1/accounts');
const {createTransactions, getAllTransactions, getTransactionsById} = require('../../handlers/v1/transactions');
const {restrict} = require('../../middlewares/auth.middlewares');


route.get('/', (req, res) => {
    res.status(200).json({
        status: false,
        message: "Not Found",
        data: null
    })
});

// users
route.post('/auth/register', register);
route.post('/auth/login', login);
route.get('/auth/authenticate', restrict, authenticate);
route.get('/users', getAllUsers);
route.get("/users/:id", getUserById);

// account
route.post('/account', createAccount);
route.get('/accounts', getAllAccount);
route.get("/accounts/:id", getAccountById);


// transactions
route.post('/transaction', createTransactions);
route.get('/transactions', getAllTransactions);
route.get("/transactions/:id", getTransactionsById);

module.exports = route;