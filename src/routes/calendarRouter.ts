import express, { Request, Response } from 'express';
import { calendarService } from '../service/CalendarService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const schedules = await calendarService.getAnnualCalendar();
  return res.status(200).json(schedules);
})

router.get('/latest', async (req: Request, res: Response) => {
  const schedules = await calendarService.getLatestPlans();
  return res.status(200).json(schedules);
});

router.get('/holiday', async (req: Request, res: Response) => {

  const startDate = req.query.startDate?.toString();
  const endDate = req.query.endDate?.toString();

  try {
    const holidays = await calendarService.getHolidays(startDate, endDate);
    return res.status(200).json(holidays)
  } catch (error) {
    return res.status(401).send(error)
  }
})

export const calendarRouter = router;
