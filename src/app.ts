import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to plants project api');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
