import { CalendarService } from '../src/service/CalendarService';
const calendarService = new CalendarService();

describe('calendar test', () => {
  it('getAnnualCalendar test - 1', async (done) => {
    const result = await calendarService.getAnnualCalendar();
    expect(result).toBeTruthy();
    done();
  });
  it('getLatestPlan test - 1', async (done) => {
    const result = await calendarService.getLatestPlans();
    expect(result).toBeTruthy();
    expect(result.calendar.length).toBeLessThanOrEqual(3);
    done();
  });
  it('getHolidays test - 1', async (done) => {
    const result = await calendarService.getHolidays();
    expect(result).toBeTruthy();
    done();
  });
});
