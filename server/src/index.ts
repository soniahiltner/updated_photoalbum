import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

mongoose
  .connect(process.env.MONGO_URI || '', {
    dbName: process.env.MONGO_DB_NAME || 'photo-album'
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Connected to MongoDB and Server is running at http://localhost:${PORT}`
      )
    })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
