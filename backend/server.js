const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 9000;

app.get('/', (request, response, next) => {
    console.log('Request received');
    response.send('Thanks you for your request. This is our response')
});

app.get('/something', (request, response, next) => {
    console.log('Request received for something endpoint.');
    response.send('Thanks you for your request. This is our response for something endpoint.')
});

app.get('/api/v1/users', (request, response, next) => {
    console.log('Request received for users endpoint.');
    const users = [{
        name: "John",
        surname: "Doe"
    }]
    response.send(JSON.stringify(users));
});

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});