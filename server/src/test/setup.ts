import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Cargar variables de entorno para testing
dotenv.config({ path: '.env.test' })

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Crear una instancia de MongoDB en memoria para tests
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  // Conectar mongoose a la base de datos de testing
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  // Limpiar y cerrar conexiones después de todos los tests
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

beforeEach(async () => {
  // Limpiar colecciones antes de cada test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    if (collection) {
      await collection.deleteMany({})
    }
  }
})

afterEach(() => {
  // Limpiar mocks después de cada test si es necesario
  // vi.restoreAllMocks() // descomenta si usas mocks
})
