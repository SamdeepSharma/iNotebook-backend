const mongoose = require('mongoose')
require("dotenv").config()

const password = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://SamdeepSharma:${password}@inotebook.7082vbv.mongodb.net/iNotebook`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const connectToDB = async() =>{
    console.log(process.env.MONGO_PASSWORD)
     await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

module.exports = connectToDB;