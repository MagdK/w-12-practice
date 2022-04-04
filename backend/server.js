const { response } = require('express');
const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();


app.get('/', (req, res, next) => { 
    //console.log('Request received.');
    //res.send('Thank you for your request! This is our response.')
    
    //ezzel bármilyen létező filet kiszolgálhatunk, ezzel az index.html-el minden filet ki tudunk szolgálni
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
})

//példa gyakorlásnak: itt a somefile.json-t szolgáljuk ki a kismacska endpointon
app.get('/kismacska', (req, res, next) => { 
    res.sendFile(path.join(`${__dirname}/../frontend/someFile.json`));
})

app.get('/something', (req, res, next) => {
    console.log('Request received on something endpoint.');
    res.send('Thank you for your request! This is our response for something endpoint.')
})

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    /*
    const users = [
        {
            name: 'John',
            surname: "Doe",
            status: 'active',
        },
        {
            name: 'Jane',
            surname: "Doe",
            status: 'passive',
        }
    ]
    res.send(JSON.stringify(users)) //a users változót stringként visszaküldjük a frontendnek
    */
  
    res.sendFile(path.join(`${__dirname}/../frontend/users.json`)); 
});


const userFile = path.join(`${__dirname}/../frontend/users.json`)

app.get('/api/v1/users/active', (req, res, next) => {
    fs.readFile(userFile, (error, data) => {
        if (error) {
            res.send("Error at file reading")
        } else {
            const users = JSON.parse(data)
            const activeUsers = users.filter(user => user.status === "active")
            res.send(activeUsers)
        }
    })
});

app.get('/api/v1/users/passive', (req, res, next) => {
    fs.readFile(userFile, (error, data) => {
        if (error) {
            res.send("Error at file reading")
        } else {
            const users = JSON.parse(data)
            const passiveUsers = users.filter(user => user.status === "passive")
            res.send(passiveUsers)
        }
    })
});





app.use('/pub', express.static(`${__dirname}/../frontend/pub`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
})

