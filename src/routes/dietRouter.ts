import express, { Request, Response } from 'express';
import { dietService } from '../service/DietService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const at = req.query.at as string;
  const where = req.query.where as string;

  const diet = await dietService.getAllDiet(at, where);
  return res.status(200).json(diet);
});

router.get('/v2/society/today', async (req: Request, res: Response) => {
  const diet = await dietService.getSocietyDiet();
  return res.status(200).json(diet);
});

router.get('/dorm/today', async (req: Request, res: Response) => {
  const diet = await dietService.getDormDiet();
  return res.status(200).json(diet);
});

router.get('/naval/today', async (req: Request, res: Response) => {
  const diet = await dietService.getNavalDietAsync();
  return res.status(200).json(diet);
});

export const dietRouter = router;
