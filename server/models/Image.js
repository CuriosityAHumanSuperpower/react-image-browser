// Image Model
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  paths: {
    type: [String],
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
  },
  GPS: {
    type: {
      lat: Number,
      lng: Number,
    },
    default: null,
  },
  faces: [
    {
      personId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
      x: Number,
      y: Number,
    },
  ],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamps: {
    type: Date,
    default: Date.now,
  },
  imageExtension: {
    type: String,
    required: true,
  },
  tagsID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;