import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';
import { CalendarService } from './service/CalendarService';
import { DietService } from './service/DietService';
import { NoticeService } from './service/NoticeService';
import { ShuttleService } from './service/ShuttleService';
import { WeatherService } from './service/weatherService';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;
  const params = event.pathParameters;
  const bstopid = params?.bstopId;

  const shuttleService = new ShuttleService();
  const busService = new BusService();
  const calendarService = new CalendarService();
  const dietService = new DietService();
  const weatherService = new WeatherService();

  if (bstopid && path === '/businfo/' + bstopid) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: await busService.getSpecificNode(bstopid),
        path: path,
      }),
    };
  }

  if (path === '/businfo') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: await busService.getAllNode(),
        path: path,
      }),
    };
  }

  if (path === '/holiday') {
    // 휴일
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: calendarService.getHoliday(),
        path: path,
      }),
    };
  }

  if (path === '/calendar/latest') {
    // 학사 일정
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: calendarService.getLatestPlans(),
        path: path,
      }),
    };
  }

  if (path === '/calendar') {
    // 학사 일정
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: calendarService.getAcademicCalendar(),
        path: path,
      }),
    };
  }

  if (path === '/notices') {
    // 학사 일정
    const noticeService = new NoticeService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: await noticeService.getAcademicNotice(),
        path: path,
      }),
    };
  }

  if (path === '/shuttle/next') {
    // MARK: 현재시각 기준 다음 셔틀 리스트
    const res = shuttleService.getNextShuttle();
    return {
      statusCode: typeof res === 'string' ? 404 : 200,
      body: JSON.stringify({
        data: res,
        path: path,
      }),
    };
  }

  if (path === '/shuttle/today') {
    // 오늘의 모든 셔틀
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getTodayShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/timetable/190') {
    // 190 시간표
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getDepart190(),
        path: path,
      }),
    };
  }

  if (path === '/timetable/shuttle') {
    // 모든 셔틀
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getAllShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/diet/society/today') {
    // MARK: 오늘의 어울림관 식단 (2층, 5층)
    const res = await dietService.getSocietyDietAsync();
    return {
      statusCode: typeof res === 'string' ? 404 : 200,
      body: JSON.stringify({
        data: res,
        path: path,
      }),
    };
  }

  if (path === '/diet/v2/society/today') {
    const result = await dietService.getSocietyDiet();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result,
        path: path,
      }),
    };
  }

  if (path === '/diet/dorm/today') {
    const res = await dietService.getDormDiet();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: res,
        path: path,
      }),
    };
  }

  if (path === '/diet/naval/today') {
    // MARK: 오늘의 해사대 식단
    const res = await dietService.getNavalDietAsync();
    return {
      statusCode: typeof res === 'string' ? 404 : 200,
      body: JSON.stringify({
        data: res,
        path: path,
      }),
    };
  }

  if (path === '/weather/now') {
    // MARK: 현재 영도구 날씨
    const res = await weatherService.getCurrentWeather();
    return {
      statusCode: typeof res === 'string' ? 404 : 200,
      body: JSON.stringify({
        data: res,
        path: path,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: 'success',
      path: path,
      result: params,
    }),
  };
};

export { dolphin };
