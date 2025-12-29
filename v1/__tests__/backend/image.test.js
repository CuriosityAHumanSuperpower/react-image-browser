// Image Model Tests
import mongoose from 'mongoose';
import Image from '../../server/models/Image.js';
import connectDB from '../../server/config/db.js';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Image Model', () => {
  it('should create a new image', async () => {
    const image = new Image({
      hash: 'uniquehash123',
      paths: ['/path/to/image.jpg'],
      ownerId: new mongoose.Types.ObjectId(),
      imageExtension: 'jpg',
    });
    await image.save();
    expect(image._id).toBeDefined();
  });

  it('should require a hash', async () => {
    const image = new Image({
      paths: ['/path/to/image.jpg'],
      ownerId: new mongoose.Types.ObjectId(),
      imageExtension: 'jpg',
    });
    let err;
    try {
      await image.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});