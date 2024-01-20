const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

//middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb://localhost:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
 
async function run()  {
    console.log('mongo is online');
    try{
        const userCollection = client.db('nodeMongoCrud').collection('users');
        //get or read all data
        app.get('/users', async(req,res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        //get or read a particular data
        app.get('/users/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        //post or create
        app.post('/users', async(req, res)=>{
            const user = req.body;
            console.log(user);
            
            const result = await userCollection.insertOne(user);
            console.log(result);
            //const _id = result.insertedId;
            res.send(result);

        })

        //put or update
        app.put('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const user = req.body;
            const option = {upsert: true};
            const updatedUser ={
                $set:{
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            console.log(updatedUser);
            res.send(result);

        })

        //delete
        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            //const sid = '\''+id+'\'';

            const query = {_id: new ObjectId(id)}
            console.log(query);
            //console.log(query);
            //console.log(_id);
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
        
        
    } finally{

    }
}
run().catch(err => console.log(err));


app.get('/',(req, res) =>{
    res.send("it's a CRUD server");
});

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})