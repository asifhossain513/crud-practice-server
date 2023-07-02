const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.37e86ox.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeCollection =client.db("insertDB").collection('coffee')


    // Get Coffe from server
    app.get('/coffee', async(req, res) => {
      const cursor =  coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Read 1

    app.get('/coffee/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await coffeCollection.findOne(query);
      res.send(result)
    })

    // Update 1
    app.put('/coffee/:id', async(req, res)=> {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = {_id : new ObjectId(id)};
    const options = { upsert: true };
      const coffee = {
      $set:{
      name : updatedCoffee.name,
      chef: updatedCoffee.chef,
      supplier: updatedCoffee.supplier,
      taste: updatedCoffee.taste,
      category: updatedCoffee.category,
      details: updatedCoffee.details,
      photo: updatedCoffee.photo,
        }
      }
      const result = await coffeCollection.updateOne(filter, coffee, options);
      res.send(result);
    })

    // Post or add coffee to server 

    app.post('/coffee', async(req, res)=> {
    const newCoffee = req.body;
    const result = await coffeCollection.insertOne(newCoffee);
    res.send(result);
    console.log(newCoffee)
  })


  // Delete item

  app.delete('/coffee/:id', async(req, res)=> {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await coffeCollection.deleteOne(query)
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// End of mongo script

app.get('/', (req, res)=> {
    res.send('Coffee server is working')
})


app.listen(port, ()=> {
    console.log('Coffee server is running on port:', port)
})


