// User Model
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['admin', 'user'],
    default: ['user'],
  },
  MFAConfig: {
    type: Object,
    default: null,
  },
  googleSSOIDs: {
    type: [String],
    default: [],
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;