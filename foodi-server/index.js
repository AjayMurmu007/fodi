const express = require("express");
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;

require('dotenv').config()
// console.log(process.env.S3_BUCKET)



// middleware
app.use(cors());
app.use(express.json());
//



//mongodb config

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-cluster.mguyr2b.mongodb.net/?appName=demo-foodi-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // database & collection

    const menuCollections = client.db("demo-foodi-cluster").collection("menus");
    const cartCollections = client.db("demo-foodi-cluster").collection("cartItems");


    //

    // all menuItems operation

    app.get('/menu', async (req, res) => {
        const result = await menuCollections.find().toArray();
        res.send(result);
    })

    //

    // all carts operations

    //posting cart to DB

    app.post('/carts', async (req, res) => {
        const CartItem = req.body;
        const result = await cartCollections.insertOne(CartItem);
        // res.status(201).json({ message: "Cart item added successfully!", data: result.ops[0] });
        res.send(result);
    })

    //

    // get carts using email
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const filter = {email: email};
      const result = await cartCollections.find(filter).toArray();
                              // ya //
      // const result = await cartCollections.find({ email }).toArray();
      res.send(result);
    })
    //


    // get specific carts
    app.get('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await cartCollections.findOne(filter);
      res.send(result);
    })
    

    // delete items from cart
    app.delete('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await cartCollections.deleteOne(filter);
      res.send(result);
    })


    // Update cart quantity
    app.put('/carts/:id', async(req, res) => {
      const id = req.params.id;
      const { quantity } = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: parseInt(quantity, 10),
        },
      };

      const result = await cartCollections.updateOne(filter, updateDoc, options);
    
    });



    
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
