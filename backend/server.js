const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();

// minden get es post url ele kell az alabbi sor, a megfelelő esetekben json-ne alakítja
app.use(express.json()); 

//frontendFolder változóba mentve az elérése a frontendnek
// https://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
const fFolder = path.resolve(__dirname, '..', 'frontend');
// kulon valtozoba kimentjuk az elerhetoseget
// const fFolder = `${__dirname}/../frontend`; 


app.get('/', (req, res, next) => { 
    //console.log('Request received.');
    //res.send('Thank you for your request! This is our response.')
    
    //ezzel bármilyen létező filet kiszolgálhatunk, ezzel az index.html-el minden filet ki tudunk szolgálni
    res.sendFile(path.join(fFolder, "index.html"));
});

app.get('/admin/order-view', (req, res, next) => { 
    res.sendFile(path.join(`${fFolder}/index.html`));
});

//példa gyakorlásnak: itt a somefile.json-t szolgáljuk ki a kismacska endpointon
app.get('/kismacska', (req, res, next) => { 
    res.sendFile(path.join(`${fFolder}/someFile.json`));
});

app.get('/something', (req, res, next) => {
    console.log('Request received on something endpoint.');
    res.send('Thank you for your request! This is our response for something endpoint.')
});

//változóba mentjük az elérhetőséget
const userFile = path.join(`${fFolder}/users.json`);

app.get('/api/v1/users', (req, res, next) => {
    console.log('Request received for users endpoint.');
    res.sendFile(path.join(`${fFolder}/users.json`)); 
});


// QUERY = url vegere ?apiKey=apple, routing-nak hivjak
app.get('/api/v1/users-query', (req, res) => {
    console.dir(req.query);
    console.log(req.query.apiKey);
    
    if (req.query.apiKey === "apple") {
        res.sendFile(`${fFolder}/users.json`)
    } else {
        res.send("Unauthorised request")
    }
});


// PARAM - modernebb megoldas - a bongeszoben toroljuk a :key reszt es apple-t irunk a helyere, terminal is visszadobja key-kent az apple-t
app.get('/api/v1/users-params/:key', (req, res) => {
    console.dir(req.params);
    console.log(req.params.key);
    if(req.params.key === "apple") {
        res.send("Azt írtad be, hogy apple")
    } else {
        res.send("Nem azt irtad be, hogy alma");
    }
});

// active és passive paramsra átalakítva egy get request-be
app.get('/api/v1/users/:key', (req, res, next) => {
     //fs.readFile-nál error és data van mindig
    fs.readFile(userFile, (error, data) => {
        const users = JSON.parse(data) // JSON.parse javascript objektumma konvertalja a json file-t
        if(req.params.key === "active") {
            const activeUsers = users.filter(user => user.status === "active");
            res.send(activeUsers)
        } else if(req.params.key === "passive") {
            const passiveUsers = users.filter(user => user.status === "passive");
            res.send(passiveUsers)
        } else {
            res.send("Something went wrong.")
        }
    })
});

// QUERY vs PARAMS - melyiket erdemes hasznalni? Ez a helyzettol fugg. 
// QUERY - univerzalis webes standard
// PARAMS - ez az express js-hez kapcsolodik


app.get('/admin/order-overview', (req, res, next) => { 
    res.sendFile(path.join(fFolder, 'index.html'))
});


// app.get('/api/v1/users-params/key', (req, res, next) => {
//      //fs.readFile-nál error és data van mindig
//     fs.readFile(userFile, (error, data) => {
//         if (error) {
//             res.send("Error at file reading")
//         } else {
//             const users = JSON.parse(data)
//             const activeUsers = users.filter(user => user.status === "active")
//             res.send(activeUsers)
//         }
//     })
// });


// app.get('/api/v1/users/active', (req, res, next) => {
//     fs.readFile(userFile, (error, data) => {
//         if (error) {
//             res.send("Error at file reading")
//         } else {
//             const users = JSON.parse(data)
//             const activeUsers = users.filter(user => user.status === "active")
//             res.send(activeUsers)
//             res.send(users.filter(user => user.status === "active"));
//             //egyesével megyünk végig a usereken a filterben, ezért egyesszámban írjuk a filteren belül)
//         }
//     })
// });

// app.get('/api/v1/users/passive', (req, res, next) => {
//     fs.readFile(userFile, (error, data) => {
//         if (error) {
//             res.send("Error at file reading")
//         } else {
//             const users = JSON.parse(data)
//             const passiveUsers = users.filter(user => user.status === "passive")
//             res.send(passiveUsers)
//             res.send(users.filter(user => user.status === "passive"));
//             //egyesével megyünk végig a usereken a filterben, ezért egyesszámban írjuk a filteren belül)
//         }
//     })
// });


// adat hozzáadása json filehoz:


app.post("/users/new", (req, res) => {
    fs.readFile(`${fFolder}/users.json`, (error, data) => {
        if(error) {
            console.log(error);
            res.send("Error reading users file.");
        } else {
            const users = JSON.parse(data);
            console.log(req.body);
            users.push(req.body);

            // wrtieFile metodus - meg kell adni az eleresi utvonalat, plusz string-ge kell alakitani, hogy a fajlba bele tudjuk irni
            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => {
                if(error) {
                    console.log(error);
                    res.send("Error writing users file.");
                }
            })
            // itt kuldjuk vissza a valaszuzenetet
            res.send(req.body);
        }
    })
});

//minden request beérkezett ide a terminálba

/*  
https://www.w3schools.com/js/js_window_location.asp

document.getElementById("demo").innerHTML = 
"The full URL of this page is:<br>" + window.location.href; // -> https://www.w3schools.com/js/tryit.asp?filename=tryjs_loc_href

document.getElementById("demo").innerHTML = 
"The full URL of this page is:<br>" + window.location.pathname; // -> /js/tryit.asp
*/


// listen elé kell ezt tenni, hogy ne akadjon össze
app.use('/pub', express.static(`${__dirname}/../frontend/pub`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
});

