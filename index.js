const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const Port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqwof3p.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

console.log("Database connected");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const appointmentOptionCollection = client
      .db("doctorsPortal")
      .collection("appointmentOptions");
  } finally {
  }
}

run().catch(console.log);

app.listen(Port, () => {
  console.log(`Server Running on Port ${Port}`);
});
