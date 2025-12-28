// Collection Model
import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mainFolder: {
    type: String,
    required: true,
  },
  settings: {
    type: Object,
    default: {},
  },
});

const Collection = mongoose.model('Collection', CollectionSchema);

export default Collection;