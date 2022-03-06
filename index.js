const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');


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
      const customerReviews = database.collection('customer-review');

    //   Get Method
    app.get('/all-products',async(re,res)=>{
        const cursor = allProducts.find({});
        const products = await cursor.toArray();
        res.send(products);
    })
    app.get('/customer-review',async(re,res)=>{
        const cursor = customerReviews.find({});
        const customerReview = await cursor.toArray();
        res.send(customerReview);
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