const bodyParser = require('body-parser');
const express = require('express')
const connectToDB = require('./db');
const cors = require('cors')
const app = express() 

connectToDB();
app.use(cors());

const port = 5000

app.use(bodyParser.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/',(req, res)=>{
  res.send("Hello from iNotebook Cloud!")
})

app.listen(port, () => {
  console.log(`iNotebook Cloud listening on port ${port}`)
})