import { shuttleBus } from '../constants/shuttle';
import { testPeriod } from '../constants/testperiod';
import { toKSTString, addPaddingNumber } from '../constants/function/commonfunction';

interface ShuttleBus {
  type: string;
  time: string;
}
export class ShuttleService {
  public getNextShuttle(): ShuttleBus[] {
    const date = new Date();
    if (date.getDay() == 0 || date.getDay() == 6) return [];

    const now = toKSTString();

    const type = this.checkTestPeriod() ? 'test' : this.checkVacation() ? 'vacation' : 'normal';

    const tmp = shuttleBus.filter(schedule => Number(schedule.time) > Number(now.substr(8, 4)) && schedule.type == type);

    var result = [];
    result.push(tmp[0]);
    result.push(tmp[1]);
    return result;
  }

  public getAllShuttle(): ShuttleBus[] {
    return shuttleBus;
  }

  private checkVacation(): boolean {
    const month = new Date().getMonth();
    if (month == 7 || month == 8 || month == 1 || month == 2) return true;
    else return false;
  }

  private checkTestPeriod(): boolean {

    const now = new Date();
    const today = now.getFullYear() + addPaddingNumber(now.getMonth() + 1) + addPaddingNumber(now.getDate());

    let flag: boolean = false;

    testPeriod.forEach(function (period) {
      if (today >= period.term.startedAt && today <= period.term.endedAt) {
        flag = true;
      }
    });

    return flag;
  }
}
