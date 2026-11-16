import express from 'express';
import { getCatalogos } from '../controllers/catalogoController.js';

const router = express.Router();

router.get('/', getCatalogos); // GET /api/catalogos

export default router;
