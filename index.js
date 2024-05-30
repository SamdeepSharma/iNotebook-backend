const bodyParser = require('body-parser');
const express = require('express')
const connectToDB = require('./db');
const cors = require('cors')
const app = express() 

connectToDB();

const allowedOrigins = [
  'http://3.111.30.209:5173', // Frontend URL 1 AWS EC2
  'http://localhost:5173', // Frontend URL 2
  'https://i-notebook-cloud-secure.vercel.app' // Vercel Deployment URL
];

app.use(cors({
  origin: (origin, callback) => {
    // Check if the request origin is in the allowedOrigins array
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Deny the request
    }
  }
}));

const port = 5000

app.use(bodyParser.json())
app.use('/', (req,res)=>{
  res.send('Welcome to iNotebook-Cloud')
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook-Cloud is up and running`)
})