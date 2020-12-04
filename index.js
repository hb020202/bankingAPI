const express = require('express');
const bodyP = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3003;

//gotta setup bodyparser before trying to post so it knows what to expect
app.use(bodyP.json());
app.use(bodyP.urlencoded({extended: false}));

const url = "mongodb://root:password@localhost:27017";

//function to add new accounts to db
let insertDataInDB = (db, dataToSend) => {
    let collection = db.collection('accounts');
    collection.insertOne(dataToSend);
}






//route to post new accounts to
//POST localhost:x/accounts - body - x-www... - key/value - send
app.post('/accounts', (req, res) => {
    let newAccHolder = req.body.accholder;
    let newAccName = req.body.accname;
    let newAddress = req.body.address;
    let newBalance = req.body.balance;
    let dataToSend = {
        accholder : newAccHolder,
        accname : newAccName,
        address : newAddress,
        balance : newBalance
    }
    mongoClient.connect(url,
        {useNewUrlParser: true, useUnifiedTopology:true},
        (error, client) => {
        console.log('connected');
        let db = client.db('bankstuff');
        insertDataInDB(db, dataToSend);
        })
    res.send('inserted');
})

//home route of nada
app.get('/', (req, res) => { res.send('hi') })
//useful thing
app.listen(port, ()=>{ console.log(`yeet on http://localhost:${port}`) })

