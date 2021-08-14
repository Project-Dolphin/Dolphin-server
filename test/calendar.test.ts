import { CalendarService } from '../src/service/CalendarService';
const calendarService = new CalendarService();

describe('calendar test', () => {
  it('getAcademiCalendar test - 1', async (done) => {
    const result = await calendarService.getAcademicCalendar();
    expect(result).toBeTruthy();
    done();
  });
  it('getLatestPlan test - 1', async (done) => {
    const result = await calendarService.getLatestPlans();
    expect(result).toBeTruthy();
    expect(result.length).toBeLessThanOrEqual(2);
    done();
  });
});
