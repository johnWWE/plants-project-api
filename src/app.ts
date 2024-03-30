import dotenv from 'dotenv';

import app from './middleware/middleware';
import router from './routes/routes';

import { connectToMongoDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://doesnt.exist:27017/test';

// MongoDB Connection
connectToMongoDB(MONGODB_URI);

// Routes
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server runing in: http://localhost:${PORT}`);
});
