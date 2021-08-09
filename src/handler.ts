import { Handler, APIGatewayEvent } from 'aws-lambda';
import { BusService } from './service/BusService';
import { CalendarService } from './service/CalendarService';
import { NoticeService } from './service/NoticeService';
import { ShuttleService } from './service/ShuttleService';

const dolphin: Handler = async (event: APIGatewayEvent) => {
  const path = event.path;

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

  if (path === '/nextshuttle') {
    // 다음 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getNextShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/allshuttle') {
    // 모든 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getAllShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/dayshuttle') {
    // 그 날의 모든 셔틀
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getDayShuttle(),
        path: path,
      }),
    };
  }

  if (path === '/allnode') {
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

  if (path.includes('/specificnode/')) {
    // 특정 정류장의 도착 정보
    const busService = new BusService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: busService.getSpecificNode(Number(path.substr(14))),
        path: path,
      }),
    };
  }

  if (path === '/depart190') {
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: 'success',
      path: path,
    }),
  };
};

export { dolphin };
