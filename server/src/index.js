import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import catalogoRoutes from './routes/catalogoRoutes.js';
import { usuarioRoutes, clienteRoutes } from './routes/personaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas activas
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/catalogos', catalogoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);

app.get('/', (req, res) => {
  res.json({ estado: 'OK', mensaje: 'API Backend Joyería / Orfebrería funcionando' });
});

// 404 para rutas de API desconocidas
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor API REST corriendo en http://localhost:${PORT}`);
  });
}

// Vercel detecta la app por este export (zero-config Express).
export default app;
