const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/iNotebook"

const connectToDB = async() =>{
     await mongoose.connect(mongoURI)
     console.log('Connected to DB Successfully')
}

module.exports = connectToDB;