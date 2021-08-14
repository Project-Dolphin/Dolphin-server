import { Handler, APIGatewayEvent } from 'aws-lambda';
import { CalendarService } from './service/CalendarService';
import { NoticeService } from './service/NoticeService';
import { ShuttleService } from './service/ShuttleService';
import { BusService } from './service/BusService';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;
  const shuttleService = new ShuttleService();
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
    // const shuttleService = new ShuttleService();
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
    // const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getDayShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/timetable/190') {
    // 특정 정류장의 도착 정보
    const busService = new BusService();
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
    // const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getAllShuttle(),
        path: path,
      }),
    };
  }

  const querystring = event.pathParameters ? event.pathParameters.bstopid : null;

  if (querystring == null) {
    // 운행중인 모든 버스
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getAllNode(),
        path: path,
      }),
    };
  }

  if (querystring != null) {
    // 특정 정류장의 도착 정보
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getSpecificNode(querystring),
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
