// User Model Tests
import mongoose from 'mongoose';
import User from '../../server/models/User.js';
import connectDB from '../../server/config/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should create a new user', async () => {
    const user = new User({
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      roles: ['user'],
    });
    await user.save();
    expect(user._id).toBeDefined();
  });

  it('should require an email', async () => {
    const user = new User({
      passwordHash: 'hashedpassword',
      roles: ['user'],
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});