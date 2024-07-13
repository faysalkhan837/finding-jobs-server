const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// carrierBild
// lcCOy4vMgYSbgBqG

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kg7cyoc.mongodb.net/?appName=Cluster0`;

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

        const jobDatas = client.db("carrierBild").collection("workData");
        const bidDatas = client.db("carrierBild").collection("bidingData");
        const allUsers = client.db("carrierBild").collection("users");


        app.get("/jobData", async (req, res) => {
            const result = await jobDatas.find().toArray();
            res.send(result);
        })
        app.get("/jobData/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobDatas.findOne(query);
            res.send(result)
        })
        app.post("/bidingData", async(req, res) =>{
            const bidInfo = req.body;
            const result = await bidDatas.insertOne(bidInfo);
            res.send(result);
        })
        app.post("/users", async(req, res) =>{
            const userData = req.body;
            const result = await allUsers.insertOne(userData);
            res.send(result);
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


app.get('/', (req, res) => {
    res.send("server is running")
})
app.listen(port, () => {
    console.log(`server is running on port : ${port}`)
})