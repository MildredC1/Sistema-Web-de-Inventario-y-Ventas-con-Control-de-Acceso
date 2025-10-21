import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT 
const HOST = process.env.HOST 

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
