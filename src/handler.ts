import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';
import { CalendarService } from './service/CalendarService';
import { NoticeService } from './service/NoticeService';
import { ShuttleService } from './service/ShuttleService';

const dolphin: Handler = async (event: APIGatewayEvent) => {

  const path = event.path;
  const params = event.pathParameters;
  const bstopid = params?.bstopId;

  const shuttleService = new ShuttleService();
  const busService = new BusService();
  const calendarService = new CalendarService();

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
      result: params,
    }),
  };
};

export { dolphin };
