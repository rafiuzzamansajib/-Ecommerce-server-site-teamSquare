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