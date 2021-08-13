import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';
import { CalendarService } from './service/CalendarService';
import { NoticeService } from './service/NoticeService';
import { ShuttleService } from './service/ShuttleService';

const dolphin: Handler = async (event: APIGatewayEvent) => {

  const path = event.path;
  const bstopid = event.pathParameters?.bstopid;

  const shuttleService = new ShuttleService();

  if (bstopid && path === `/businfo/${bstopid}`) {
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: await busService.getSpecificNode(bstopid),
        path: path,
      }),
    };
  }

  if (path === '/businfo') {
    const busService = new BusService();
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
    const calendarService = new CalendarService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: calendarService.getHoliday(),
        path: path,
      }),
    };
  }

  if (path === '/calendar') {
    // 학사 일정
    const calendarService = new CalendarService();
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
        data: await noticeService.getMainNotice(),
        path: path,
      }),
    };
  }

  if (path === '/shuttle/next') {
    // 다음 셔틀
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getNextShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/shuttle/today') {
    // 그 날의 모든 셔틀
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getDayShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/timetable/190') {
    const busService = new BusService();
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: 'success',
      path: path,
    }),
  };
};

export { dolphin };
