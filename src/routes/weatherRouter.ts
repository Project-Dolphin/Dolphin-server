import express from 'express';
import { weatherService } from '../service/weatherService';

const router = express.Router();

router.get('/now', async (req, res) => {
  const weather = await weatherService.getCurrentWeather();
  return res.status(200).json(weather);
});

export const weatherRouter = router;
