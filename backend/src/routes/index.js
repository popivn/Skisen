import express from 'express';
import detectRouter from './detect.js';

const router = express.Router();

router.use('/', detectRouter);

export default router;
