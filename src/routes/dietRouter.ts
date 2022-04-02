import express from 'express';
import { dietService } from '../service/dietService2';

const router = express.Router();

router.get('/v2/society/today', async (req, res) => {
  const diet = await dietService.getSocietyDiet();
  return res.status(200).json(diet);
});

router.get('/dorm/today', async (req, res) => {
  const diet = await dietService.getDormDiet();
  return res.status(200).json(diet);
});

router.get('/naval/today', async (req, res) => {
  const diet = await dietService.getNavalDietAsync();
  return res.status(200).json(diet);
});

export const dietRouter = router;
