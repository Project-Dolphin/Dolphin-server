import { CalendarService } from '../src/service/CalendarService';

const calendarService = new CalendarService();

describe('index test', () => {
  it('test1', (done) => {
    expect(1).toBe(1);
    done();
  });
  it('test2', async (done) => {
    const result = await calendarService.getCalendar();
    console.log(result);
    expect(result).toBeTruthy();
    done();
  });
});
