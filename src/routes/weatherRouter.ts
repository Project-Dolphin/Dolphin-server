import express, { Request, Response } from 'express';
import { weatherService } from '../service/weatherService';

const router = express.Router();

router.get('/now', async (req: Request, res: Response) => {
  const weather = await weatherService.getCurrentWeather();
  return res.status(200).json(weather);
});

export const weatherRouter = router;
