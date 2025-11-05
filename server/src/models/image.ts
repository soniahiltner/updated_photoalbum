import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  filename: String,
  url: String,
  isFavourite: {
    type: Boolean,
    default: false
  },
  albums: {
    type: [String],
    default: []
  }
})

export const Image = mongoose.model('Image', imageSchema)