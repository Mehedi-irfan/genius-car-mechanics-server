const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const { json } = require('express');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wukom.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET SINGLE SERVICES
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hiting the database', id);
            const query = { _id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        //DELETE API   
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id : ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
           console.log('hitting the post', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running genius server')
})

app.get('/hello', (req, res) => {
    res.send('hello update here')
})

app.listen(port, () => {
    console.log('running genius server on port', port);
})