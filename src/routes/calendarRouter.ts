import express, { Request, Response } from 'express';
import { calendarService } from '../service/CalendarService';
import { extractNumber } from '../util/parseNumber';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const schedules = await calendarService.getAnnualCalendar();
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/monthly', async (req: Request, res: Response) => {
  const year = extractNumber(req.query.year?.toString() ?? '');
  const month = extractNumber(req.query.month?.toString() ?? '');
  if (year < 2000 || year > 3000) {
    res.status(400).send('Year is invalid.');
  }
  if (month < 1 || month > 12) {
    res.status(400).send('Month is invalid.');
  }
  try {
    const schedules = await calendarService.getMonthlyCalendar(year, month);
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/latest', async (req: Request, res: Response) => {
  try {
    const schedules = await calendarService.getLatestPlans();
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/holiday', async (req: Request, res: Response) => {
  const startDate = req.query.startDate?.toString();
  const endDate = req.query.endDate?.toString();

  try {
    const holidays = await calendarService.getHolidays(startDate, endDate);
    return res.status(200).json(holidays);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export const calendarRouter = router;
