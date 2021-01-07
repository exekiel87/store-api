const express = require('express');
const Items = require('./items.js');

module.exports = function () {

    const api = express.Router();

    const items = Items();
    
    api.use('/', items);
    
    return api;
}