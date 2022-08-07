import express, { Request, Response } from 'express';
import { calendarService, LatestPlans } from '../service/CalendarService';
import { dietService, SocietyDietResult } from '../service/DietService';
import { DateType, mainService } from '../service/mainService';
import { Notice, noticeService } from '../service/NoticeService';
import { WeatherResult, weatherService } from '../service/weatherService';

const router = express.Router();

interface Home {
  dayType: DateType;
  schedules: LatestPlans | null;
  weather: WeatherResult | null;
  notices: Notice[];
  diets: SocietyDietResult | null;
}


router.get('/', async (req: Request, res: Response) => {
  const homeData: Home = {
    dayType: '평일',
    schedules: null,
    weather: null,
    notices: [],
    diets: null,
  }

  const dateType = await mainService.getTodayDateType();
  homeData.dayType = dateType;
  const schedules = await calendarService.getLatestPlans();
  homeData.schedules = schedules;
  homeData.weather = await weatherService.getCurrentWeather();
  const notices = await noticeService.getAcademicNotice();
  homeData.notices.push(...notices);
  homeData.diets = await dietService.getSocietyDiet();


  return res.status(200).json(homeData);
});



export const homeRouter = router;
