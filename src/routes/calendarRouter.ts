import express, { Request, Response } from 'express';
import { calendarService } from '../service/CalendarService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const year = Number(req.query.year) || null;
  const month = Number(req.query.month) || null;
 
  const schedules = await calendarService.getAcademicCalendar(year, month);
  return res.status(200).json(schedules);
});

router.get('/latest', async (req: Request, res: Response) => {
  const schedules = await calendarService.getLatestPlans();
  return res.status(200).json(schedules);
});

export const calendarRouter = router;
