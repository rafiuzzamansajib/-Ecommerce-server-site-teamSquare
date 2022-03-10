const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const ObjectID = require('mongodb').ObjectId


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxvqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('ecommerce-site');
      const allProducts = database.collection('all-products');
      const ordersCollection = database.collection('orders');
      const usersCollection = database.collection('users');
      const reviewCollection = database.collection('customer-review');

                                                  //   Get Method //

    // All Products
    app.get('/all-products',async(re,res)=>{
    const cursor = allProducts.find({});
    const products = await cursor.toArray();
    res.send(products);
    })


    // GET Single Products
    app.get('/all-products/:id', async (req, res) => {
    const id = req.params.id;
    console.log('getting specific service', id);
    const query = { _id: ObjectID(id) };
    const product = await allProducts.findOne(query);
    res.json(product);
    })


    // Customer Review
    app.get('/customer-reviews',async(re,res)=>{
    const cursor = reviewCollection.find({});
    const customerReview = await cursor.toArray();
    res.send(customerReview);
    })
    app.get('/users',async(re,res)=>{
    const cursor = usersCollection.find({});
    const user = await cursor.toArray();
    res.send(user);
    })


    // Get all orders
    app.get('/orders', async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
    })


    //Get specific users order
    app.get('/orders/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: req.params.email };
    console.log(email);
    const myOrders = await ordersCollection.find(query).toArray();
    console.log(myOrders);
    res.send(myOrders);
    })


    // Check Admin
    app.get('/users/:email',async(req,res)=>{
    const email=req.params.email;
    const query={email:email};
    const user=await usersCollection.findOne(query);
    let isAdmin=false;
    if(user?.role==='admin')
    {
    isAdmin=true;
    }
    res.json({admin:isAdmin});
    })


                                                // Put Method //
      app.put('/users', async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });

    // Update shipping status
    app.put('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: ObjectID(id) };
    const updatedStatus = req.body.status;
    const result = await ordersCollection.updateOne(filter, {
    $set: {
    status: updatedStatus,
    },
    });
    res.send(result);
    console.log(result);
    }); 


    // Make admin
    app.put('/makeAdmin',async (req,res)=>{
    const filter={email:req.body.email};
    const document={$set:{role:"admin"}};
    const result=await usersCollection.updateOne(filter,document);
    console.log(result);
    res.send(result);
    })


                                                 // Post Method //
    // save registered user to the database
    app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
    })


    // post Products to database 
    app.post('/addProduct', async (req, res) => {
    const product = req.body;
    const result = await allProducts.insertOne(product);
    res.json(result);
    })


    // Post order
    app.post('/addOrders', async (req, res) => {
    const order = req.body;
    console.log("Order", order);
    const result = await ordersCollection.insertOne(order);
    console.log(result);
    res.json(result);
    })


    //add review to the database
    app.post('/addReview', async (req, res) => {
    const review = req.body;
    console.log(review);
    const result = await reviewCollection.insertOne(review);
    res.json(result);
    })

                                                      //   Delete Method //

    // Delete a product
    app.delete('/all-products/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: ObjectId(id) };
    const result = await allProducts.deleteOne(query);
    res.send(result);

    })


    // Delete an Order
    app.delete('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.json(result);
    })

    } 
    finally {

    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Team Square!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})