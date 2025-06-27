import express from 'express';
import dotenv from 'dotenv';
import produtosRoutes from './routes/produtosRoutes';
import validacaoRoutes from './routes/validacaoRoutes'

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', produtosRoutes);
app.use("/api", validacaoRoutes);

app.get('/health', (_, res) => {
  res.status(200).send('API Middleware online');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Middleware rodando na porta ${PORT}`);
});
