import express, { NextFunction, Request, Response } from 'express';
import { LatestPlans } from '../service/CalendarService';
import { SocietyDietResult } from '../service/DietService';
import { DateType } from '../service/mainService';
import { Notice } from '../service/NoticeService';
import { WeatherResult } from '../service/weatherService';
import { logger } from '../logger';

const router = express.Router();

interface Home {
  dayType: DateType;
  schedules: LatestPlans | null;
  weather: WeatherResult | null;
  notices: Notice[];
  diets: SocietyDietResult | null;
}


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const homeData: Home = {
    dayType: '평일',
    schedules: { today: '2024-3-17', calendar: [] },
    weather: null,
    notices: [],
    diets: null,
  }
  try {
    logger.info(`[${req.socket?.remoteAddress}] | ${req.method} ${req.url} `);

    // const dateType = await mainService.getTodayDateType();
    // homeData.dayType = dateType;
    // const schedules = await calendarService.getLatestPlans();
    // homeData.schedules = schedules;
    // homeData.weather = await weatherService.getCurrentWeather();
    // const notices = await noticeService.getAcademicNotice();
    // homeData.notices.push(...notices);
    // homeData.diets = await dietService.getSocietyDiet();
    console.log(homeData);
    return res.status(200).json(homeData);


  } catch (e) {
    console.error(e);
    next(e);
  }

});



export const homeRouter = router;
