import express, { Request, Response } from 'express';
import { getTodayType } from '../constants/function/commonfunction';
import { calendarService, LatestPlans } from '../service/CalendarService';
import { dietService, SocietyDietResult } from '../service/DietService';
import { Notice, noticeService } from '../service/NoticeService';
import { WeatherResult, weatherService } from '../service/weatherService';

const router = express.Router();

interface Home {
  dayType: DayType;
  schedules: LatestPlans | null;
  weather: WeatherResult | null;
  notices: Notice[];
  diets: SocietyDietResult | null;
}

export enum DayType {
  WEEK = 'WEEK',
  WEEKEND = 'WEEKEND',
  // TODO: 시험기간 추가
}

router.get('/', async (req: Request, res: Response) => {
  const homeData: Home = {
    dayType: getTodayType(),
    schedules: null,
    weather: null,
    notices: [],
    diets: null,
  }

  const schedules = await calendarService.getLatestPlans();
  homeData.schedules = schedules;
  homeData.weather = await weatherService.getCurrentWeather();
  const notices = await noticeService.getAcademicNotice();
  homeData.notices.push(...notices);
  homeData.diets = await dietService.getSocietyDiet();


  return res.status(200).json(homeData);
});



export const homeRouter = router;
