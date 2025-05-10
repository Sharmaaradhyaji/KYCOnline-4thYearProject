import * as faceapi from '@vladmandic/face-api';
import canvas from 'canvas';
import path from 'path';
import fs from 'fs';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = './models';

export async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
  console.log('✅ FaceAPI models loaded');
}

export async function getFaceDescriptor(imagePath) {
  const img = await canvas.loadImage(imagePath);
  const detections = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detections) {
    throw new Error(`❌ No face detected in ${imagePath}`);
  }

  return detections.descriptor;
}

export function getEuclideanDistance(desc1, desc2) {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}
