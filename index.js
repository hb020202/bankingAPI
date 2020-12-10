const express = require('express');
const bodyP = require('body-parser');
const mconnection = require('./mongoconn');
const cors = require('cors');
const app = express();
const port = 3003;
const mongoClient = require('mongodb').MongoClient;


//gotta setup bodyparser before trying to post so it knows what to expect
app.use(bodyP.json());
app.use(bodyP.urlencoded({extended: false}));
app.use(cors());

//mongo URL
const url = "mongodb://root:password@localhost:27017";

//function to add new accounts to db
let insertDataInDB = (db, dataToSend) => {
    let collection = db.collection('accounts');
    collection.insertOne(dataToSend);
}
//function to change amount in balance
let updateBalance = (db, dataToUpdate) => {
    let collection = db.collection('accounts');
    collection.updateOne({accholder: dataToUpdate.accHolder}, {$set: {balance: dataToUpdate.updatedBalance}})
}
//function to add amount to balance
let addBalance = (db, addToBalance) => {
    let collection = db.collection('accounts');
    let newBal = addToBalance.addedBal-0;
    collection.updateOne({accholder: addToBalance.accHolder}, {$inc: {balance: newBal }})
}//function to show all
let showAll = (db) => {
    let collection = db.collection('accounts');
    collection.updateOne({accholder: addToBalance.accHolder}, {$inc: {balance: newBal }})
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
    mconnection(url, insertDataInDB, dataToSend);
    res.send('inserted');
})
//route to post new account balance
//PUT localhost:x/accounts/balance - body - x-www... - key/value - send
app.put('/accounts/balance', (req, res) => {
    const accHolder = req.body.accholder;
    const updatedBalance = req.body.balance;
    let dataToUpdate = {
         accHolder,
         updatedBalance
    }
    mconnection(url, updateBalance, dataToUpdate);
    res.send('updated');
})
//route to add to balance
//PUT localhost:x/accounts/add - body - x-www... - key/value - send
app.put('/accounts/add', (req, res) => {
    const accHolder = req.body.accholder;
    const addedBal = req.body.balance;
    let addToBalance = {
        accHolder,
        addedBal
    }
    mconnection(url, addBalance, addToBalance);
    res.send('added');
})

//route to get all accounts from
//GET localhost:x/viewall - body - x-www... - key/value - send
app.get('/viewall', (req, res) => {
    mongoClient.connect(url,
        {useNewUrlParser: true, useUnifiedTopology:true},
        (error, client) => {
            let db = client.db('bankstuff');
            db.collection('accounts').find().toArray()
            .then(results => {
                res.send(results)
            })

            console.log('connected');
        })})





//home route of nada
app.get('/', (req, res) => { res.send('hi') })
//useful thing
app.listen(port, ()=>{ console.log(`yeet on http://localhost:${port}`) })

