import { shuttleBus } from '../constants/shuttle';
import { testPeriod } from '../constants/testperiod';
import { toKSTString, makeKoreaDate } from '../constants/function/commonfunction';

interface ShuttleBus {
  type: string;
  time: string;
}
export class ShuttleService {
  public getNextShuttle(): ShuttleBus[] {
    const date = makeKoreaDate();
    if (!this.checkTestPeriod() && (date.getDay() == 0 || date.getDay() == 6)) return [];

    const now = toKSTString();

    const type = this.checkTestPeriod() ? 'test' : this.checkVacation() ? 'vacation' : 'normal';

    const tmp = shuttleBus.filter(schedule => Number(schedule.time) > Number(now.substr(8, 4)) && schedule.type == type);

    var result = [];
    for (let i = 0; i < 3; i++) {
      if (tmp[i]) result.push(tmp[i]);
      else result.push({ type: "none", time: "2359" })
    }

    console.log('checkNextShuttle : ', result);

    return result;
  }

  public getAllShuttle(): ShuttleBus[] {
    return shuttleBus;
  }

  private checkVacation(): boolean {
    const month = makeKoreaDate().getMonth();
    if (month == 7 || month == 8 || month == 1 || month == 2) return true;
    else return false;
  }

  private checkTestPeriod(): boolean {

    const today = toKSTString().substr(8, 4);
    console.log('checkTestPeriod: ', today);

    let flag: boolean = false;

    testPeriod.forEach(function (period) {
      if (today >= period.term.startedAt && today <= period.term.endedAt) {
        flag = true;
      }
    });

    return flag;
  }
}
