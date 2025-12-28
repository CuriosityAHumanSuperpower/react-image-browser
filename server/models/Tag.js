// Tag Model
import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;