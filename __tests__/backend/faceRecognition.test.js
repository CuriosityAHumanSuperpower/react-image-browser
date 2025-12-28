// Face Recognition Service Tests
import { detectFaces, recognizeFaces, storeDetectedFaces } from '../../server/services/faceRecognition.js';

describe('Face Recognition Service', () => {
  it('should detect faces in an image', async () => {
    const faces = await detectFaces('/path/to/image.jpg');
    expect(faces).toBeInstanceOf(Array);
    expect(faces.length).toBeGreaterThan(0);
  });

  it('should recognize faces', async () => {
    const faces = [{ x: 10, y: 20 }];
    const recognizedFaces = await recognizeFaces(faces, 'image123');
    expect(recognizedFaces).toBeInstanceOf(Array);
    expect(recognizedFaces.length).toBe(faces.length);
  });

  it('should store detected faces', async () => {
    const faces = [{ x: 10, y: 20 }];
    const person = await storeDetectedFaces('image123', faces);
    expect(person).toBeDefined();
    expect(person.name).toBe('Unknown');
  });
});