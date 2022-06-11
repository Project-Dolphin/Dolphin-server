import express, { Request, Response } from 'express';
import { Calendar, calendarService } from '../service/CalendarService';
import { dietService, SocietyDietResult } from '../service/DietService';
import { Notice, noticeService } from '../service/NoticeService';
import { WeatherResult, weatherService } from '../service/weatherService';

const router = express.Router();

interface Home {
  schedules: Calendar | null;
  weather: WeatherResult | null;
  notices: Notice[];
  diets: SocietyDietResult | null;
}

router.get('/', async (req: Request, res: Response) => {
  const homeData: Home = {
    schedules: null,
    weather: null,
    notices: [],
    diets: null,
  }

  const schedules = await calendarService.getAnnualCalendar();
  homeData.schedules = schedules;
  homeData.weather = await weatherService.getCurrentWeather();
  const notices = await noticeService.getAcademicNotice();
  homeData.notices.push(...notices);
  homeData.diets = await dietService.getSocietyDiet();


  return res.status(200).json(homeData);
});

export const homeRouter = router;
