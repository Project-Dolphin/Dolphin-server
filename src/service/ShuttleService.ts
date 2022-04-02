import DayJS from 'dayjs';
import PluginUtc from 'dayjs/plugin/utc';
import PluginTimezone from 'dayjs/plugin/timezone';
import { examPeriodList } from '../constants/testperiod';
import { shuttleTimeList } from '../constants/shuttle';

DayJS.extend(PluginUtc);
DayJS.extend(PluginTimezone);

interface NextShuttleResultType {
  previous?: ShuttleResultType;
  next: ShuttleResultType[];
}

interface ShuttleResultType {
  type: string;
  time: string;
}

export class ShuttleService {
  getNextShuttle(): NextShuttleResultType | string {
    const seoulToday = DayJS().tz('Asia/Seoul');
    // MARK: 시험기간이 아닌 날에는 주말에 셔틀운행x
    if (this.checkWeekend(seoulToday)) {
      return 'Today is weekend';
    }

    const type = this.checkType(seoulToday);
    return {
      previous: shuttleTimeList
        .filter((shuttle) => shuttle.type === type && +shuttle.time <= +seoulToday.format('HHmm'))
        .pop(),
      next: shuttleTimeList.filter((shuttle) => shuttle.type === type && +shuttle.time > +seoulToday.format('HHmm')),
    };
  }

  getAllShuttle(): ShuttleResultType[] {
    return shuttleTimeList;
  }

  getTodayShuttle(): ShuttleResultType[] {
    const seoulToday = DayJS().tz('Asia/Seoul');
    const type = this.checkType(seoulToday);
    return shuttleTimeList.filter((shuttle) => shuttle.type === type);
  }

  private checkType(today: DayJS.Dayjs): 'normal' | 'vacation' | 'exam' {
    if (this.checkExamPeriod(today.format('YYYYMMDD'))) {
      return 'exam';
    }
    if (this.checkVacation(today.month())) {
      return 'vacation';
    }

    return 'normal';
  }

  private checkWeekend(today: DayJS.Dayjs): boolean {
    return !this.checkExamPeriod(today.format('YYYYMMDD')) && (today.day() == 0 || today.day() == 6);
  }

  private checkVacation(month: number): boolean {
    return month == 0 || month == 1 || month == 6 || month == 7;
  }

  private checkExamPeriod(today: string): boolean {
    let isExamPeriod = false;
    examPeriodList.forEach((period) => {
      if (today >= period.term.startedAt && today <= period.term.endedAt) {
        isExamPeriod = true;
        return false;
      }

      return true;
    });

    return isExamPeriod;
  }
}

export const shuttleService = new ShuttleService();
