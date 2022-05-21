import { academicCalendar } from '../constants/calendar';

export interface Calendar {
  term: Term;
  mainPlan?: boolean;
  content: string;
  dDay?: number;
}

interface Term {
  startedAt: string;
  endedAt: string;
}

export class CalendarService {
  public getAcademicCalendar(year?: number | null, month?: number | null): Calendar[] {
    if (year && month) {
      return this.getAcademicCalendarByYearMonth(year, month);
    } else {
      return academicCalendar;
    }
  }
  private getAcademicCalendarByYearMonth(year: number, month: number): Calendar[] {
    return academicCalendar.filter(calendar => this.getYearMonth(calendar.term.startedAt) === `${year}-${month}`);
  }
  private getYearMonth(at: string): string {
    return at.substring(0, 7);
  }
  public getLatestPlans(): Calendar[] {
    const calendar = academicCalendar;
    const now = new Date();
    const plans = calendar.filter((plan) => {
      const startedAt = new Date(plan.term.startedAt);
      return startedAt.getTime() - now.getTime() > 0;
    });
    const latestPlans = plans.slice(0, 2).map((plan: Calendar) => {
      return {
        ...plan,
        dDay: this.getDay(new Date(plan.term.startedAt).getTime() - now.getTime()),
      };
    });
    return latestPlans;
  }
  private getDay(duration: number) {
    return Math.ceil(duration / (60 * 60 * 24 * 1000));
  }
}

export const calendarService = new CalendarService();
