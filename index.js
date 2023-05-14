const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDb = require('./config/dbConnection');

connectDb();

const Port = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
})