const express = require('express');
const route = express.Router();
const {createUsers, getAllUsers} = require('../../handlers/v1/users');

route.get('/', (req, res) => {
    res.status(200).json({
        status: false,
        message: "Not Found",
        data: null
    })
});

route.post('/users', createUsers);
route.get('/users', getAllUsers);


module.exports = route;