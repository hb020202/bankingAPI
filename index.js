const express = require('express');
const bodyP = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3003;

app.use(bodyP.json());
app.use(bodyP.urlencoded({extended: false}));
const url = "mongodb://root:password@localhost:27017";

let insertDataInDB = (db, dataToSend) => {
    let collection = db.collection('accounts');
    collection.insertOne(dataToSend);
}







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


app.get('/', (req, res) => {
    res.send('hi');
})

app.listen(port, ()=>{
    console.log(`yeet on http://localhost:${port}`);
})

