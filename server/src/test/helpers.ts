import request from 'supertest'
import type { Express } from 'express'

/**
 * Clase helper para facilitar los tests de API
 */
export class TestHelper {
  private app: Express

  constructor(app: Express) {
    this.app = app
  }

  /**
   * Crear un álbum de prueba
   */
  async createTestAlbum(albumData: any = {}) {
    const defaultAlbum = {
      title: 'Test Album',
      description: 'A test album',
      ...albumData
    }

    const response = await request(this.app)
      .post('/api/albums')
      .send(defaultAlbum)
      .expect(201)

    return response.body
  }

  /**
   * Crear una imagen de prueba
   */
  async createTestImage(albumId: string, imageData: any = {}) {
    const defaultImage = {
      title: 'Test Image',
      description: 'A test image',
      albumId,
      ...imageData
    }

    // Simular archivo de imagen
    const response = await request(this.app)
      .post('/api/images')
      .field('title', defaultImage.title)
      .field('description', defaultImage.description)
      .field('albumId', defaultImage.albumId)
      .attach('image', Buffer.from('fake image data'), 'test.jpg')

    return response.body
  }

  /**
   * Obtener todos los álbumes
   */
  async getAllAlbums() {
    const response = await request(this.app).get('/api/albums').expect(200)

    return response.body
  }

  /**
   * Obtener un álbum por ID
   */
  async getAlbumById(id: string) {
    const response = await request(this.app).get(`/api/albums/${id}`)

    return response
  }

  /**
   * Obtener todas las imágenes de un álbum
   */
  async getImagesByAlbum(albumId: string) {
    const response = await request(this.app)
      .get(`/api/images/album/${albumId}`)
      .expect(200)

    return response.body
  }

  /**
   * Eliminar un álbum
   */
  async deleteAlbum(id: string) {
    const response = await request(this.app).delete(`/api/albums/${id}`)

    return response
  }
}
