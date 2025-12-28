// Face Recognition Routes (Placeholder)
import express from 'express';
import { detectFaces, recognizeFaces, storeDetectedFaces } from '../services/faceRecognition.js';

const router = express.Router();

router.post('/detect', async (req, res) => {
  const { imagePath } = req.body;
  const faces = await detectFaces(imagePath);
  res.json({ faces });
});

router.post('/recognize', async (req, res) => {
  const { faces, imageId } = req.body;
  const recognizedFaces = await recognizeFaces(faces, imageId);
  res.json({ recognizedFaces });
});

router.post('/store', async (req, res) => {
  const { imageId, faces } = req.body;
  const person = await storeDetectedFaces(imageId, faces);
  res.json({ person });
});

export default router;