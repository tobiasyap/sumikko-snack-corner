import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import snackRoutes from './routes/snacks.js';
import archiveRoutes from './routes/archive.js';
import settingsRoutes from './routes/settings.js';
import { startCronJobs } from './services/cronService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/snacks', snackRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/settings', settingsRoutes);

// Serve built React client in production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

startCronJobs();

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Sumikko Snack Corner server running on port ${PORT}`);
});
