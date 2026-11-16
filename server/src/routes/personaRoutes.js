import express from 'express';
import { getUsuarios, getClientes } from '../controllers/personaController.js';

export const usuarioRoutes = express.Router();
usuarioRoutes.get('/', getUsuarios); // GET /api/usuarios

export const clienteRoutes = express.Router();
clienteRoutes.get('/', getClientes); // GET /api/clientes
