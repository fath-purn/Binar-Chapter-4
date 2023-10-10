const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.status(200).json({
        status: false,
        message: "Not Found",
        data: null
    })
});

module.exports = route;