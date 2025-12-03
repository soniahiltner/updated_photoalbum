declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer'
  import { v2 as cloudinary } from 'cloudinary'

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary
    params?: {
      folder?: string
      allowed_formats?: string[]
      format?: (req: any, file: any) => string | Promise<string>
      public_id?: (req: any, file: any) => string | Promise<string>
      [key: string]: any
    }
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions)
    _handleFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error?: any, info?: Partial<Express.Multer.File>) => void
    ): void
    _removeFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void
    ): void
  }

  export default CloudinaryStorage
}
