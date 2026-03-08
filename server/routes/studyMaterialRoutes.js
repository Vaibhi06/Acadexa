import express from 'express';
import { uploadMaterial, getMaterials, deleteMaterial } from '../controllers/studyMaterialController.js';

const router = express.Router();

router.route('/')
    .post(uploadMaterial)
    .get(getMaterials);

router.route('/:id')
    .delete(deleteMaterial);

export default router;
