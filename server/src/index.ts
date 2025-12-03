import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import imagesRouter from './routes/image.js'
import albumsRouter from './routes/album.js'

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

// Middlewares deben ir ANTES de las rutas
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/images', imagesRouter)
app.use('/api/albums', albumsRouter)

// Conectar a MongoDB y arrancar servidor
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

//route not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

//global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res
      .status(500)
      .json({ error: 'Something went wrong!', details: err.message })
  }
)
