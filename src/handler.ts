import { Handler, APIGatewayEvent } from 'aws-lambda';
import { CalendarService } from './service/CalendarService';
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

  if (path === '/shuttlenext') {
    // 학사 일정
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getShuttleNext(),
        path: path,
      }),
    };
  }

  if (path === '/shuttleall') {
    // 학사 일정
    const shuttleService = new ShuttleService();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: shuttleService.getShuttleAll(),
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
