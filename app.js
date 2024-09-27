import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connection.js'; 
import * as indexRouter from './routes/indexRouter.js'; 
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: '*' }));
app.use(express.json());
connectDB();

const baseurl = process.env.BASEURL || '/api/v1/';

app.use(`${baseurl}auth`, indexRouter.authRouter);
app.use(`${baseurl}course`,indexRouter.courseRouter)
app.use(`${baseurl}enrollCourse`,indexRouter.enrollRouter)


app.use('*', (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});