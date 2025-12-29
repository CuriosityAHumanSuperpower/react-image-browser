// Person Model
import mongoose from 'mongoose';

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isMe: {
    type: Boolean,
    default: false,
  },
  imageIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
  ],
});

const Person = mongoose.model('Person', PersonSchema);

export default Person;