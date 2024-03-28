const bodyParser = require('body-parser');
const connectToDB = require('./db')
connectToDB();

const express = require('express')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
