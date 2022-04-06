//cd backend -> npm init -y -> npm install express
const express = require('express');
const fs = require ('fs');
const path = require('path');

const port = 9000;
const app = express();

app.use(express.json()); //ezt mindig a const app alá kell írni!, a megfelelő esetekben json-ná alakítja

//frontendFolder változóba mentve az elérése a frontendnek
const fFolder = `${__dirname}/../frontend`;

//next: ha itt végzett akkor hajtson e végre műveletet vagy sem, átpasszolja a következőhöz gethez
app.get('/', (req, res, next) => { 
    //console.log('Request received.');
    //res.send('Thank you for your request! This is our response.')
    
    //ezzel bármilyen létező filet kiszolgálhatunk, ezzel az index.html-el minden filet ki tudunk szolgálni
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get('/admin/order-view', (req, res, next) => { 
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

//példa gyakorlásnak: itt a somefile.json-t szolgáljuk ki a kismacska endpointon
app.get('/kismacska', (req, res, next) => { 
    res.sendFile(path.join(`${__dirname}/../frontend/someFile.json`));
});

app.get('/something', (req, res, next) => {
    console.log('Request received on something endpoint.');
    res.send('Thank you for your request! This is our response for something endpoint.')
});

//változóba mentjük az elérhetőséget
const userFile = path.join(`${__dirname}/../frontend/users.json`);

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
    //a fenti users objectet belementettük egy users.json fileba és most elérhetővé tesszük a frontendnek
    res.sendFile(path.join(`${__dirname}/../frontend/users.json`)); 
});


app.get('/api/v1/users-query', (req, res, next) => {
    console.dir(req.query) //clg.dir kulcsértékpároknál
    console.log(req.query.apiKey)
    if (req.query.apiKey === 'apple'){
        res.sendFile(path.join(`${__dirname}/../frontend/users.json`));  
    }else{
        res.send('Unauthorized request.')
    }
});

//key értéke apple lett, mert böngészőben a :key helyére apple-t írtunk, terminálban megkapjuk az apple-t
/*app.get('/api/v1/users-params/:key', (req, res, next) => {
    console.dir(req.params) //clg.dir kulcsértékpároknál
    console.log(req.params.key)
    if(req.params.key === 'apple'){
        res.send('Almát írtál be.')
    }else{
        res.send('Nem almát írtál be.')
    }
})
*/

// app.get('/api/v1/users/active', (req, res, next) => {
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

//active és passive paramsra átalakítva egy get requestbe:
app.get('/api/v1/users-params/:key', (req, res, next) => {
    console.dir(req.params) //clg.dir kulcsértékpároknál
    console.log(req.params.key)
    fs.readFile(userFile, (error, data) => {  //userFile változó elérési útvonal
        const users = JSON.parse(data) //innen elérhető mindegyik if számára a users változó
        if(req.params.key === 'active'){
            const activeUsers = users.filter(user => user.status === "active");
            res.send(activeUsers)
        }else if(req.params.key === 'passive'){
            const passiveUsers = users.filter(user => user.status === "passive")
            res.send(passiveUsers)
        }else{
            res.send("Error happened.")
        }
    })
});

//adat hozzáadása json filehoz:
app.post("/users/new", (req, res) => {
    fs.readFile(`${fFolder}/users.json`, (error, data) => {
        if(error){
            console.log(error);
            res.send("Error reading users file.")
        } else {
            const users = JSON.parse(data)
            console.log(req.body);
            users.push(req.body);

            fs.writeFile(`${fFolder}/users.json`, JSON.stringify(users), error => {
                if(error){
                    console.log(error);
                    res.send("Error writing users file.")
                }
            })
            res.send(req.body);
        }
    })
});

//minden request beérkezett ide a terminálba

//listen elé kell ezt tenni, hogy ne akadjon össze
app.use('/pub', express.static(`${__dirname}/../frontend/pub`));

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`)
});

