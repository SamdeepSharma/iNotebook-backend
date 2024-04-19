const bodyParser = require('body-parser');
const express = require('express')
const connectToDB = require('./db');
const cors = require('cors')
const app = express() 

connectToDB();

app.use(cors({
  origin: 'http://3.111.30.209:5173'
}));

const port = 5000

app.use(bodyParser.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook-Cloud is up and running`)
})