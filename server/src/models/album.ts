import mongoose from "mongoose"

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Album must have a name'],
    unique: [true, 'Album name should be unique'],
    trim: true,
    lowercase: true,
    minlength: [3, 'Album name must have at least 3 characters'],
    maxlength: [20, 'Album name must have at most 20 characters']
  }
})

export const Album = mongoose.model('Album', albumSchema)