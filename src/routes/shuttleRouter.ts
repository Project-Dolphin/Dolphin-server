import express from 'express';
import { shuttleService } from '../service/ShuttleService';

const router = express.Router();

router.get('/next', async (req, res) => {
  const shuttleInfo = await shuttleService.getNextShuttle();
  return res.status(200).json(shuttleInfo);
});

router.get('/today', async (req, res) => {
  const shuttleInfo = await shuttleService.getTodayShuttle();
  return res.status(200).json(shuttleInfo);
});

export const shuttleRouter = router;