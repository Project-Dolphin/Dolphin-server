import { shuttleBus } from '../constants/shuttle';
import { testPeriod } from '../constants/testperiod';

interface ShuttleBus {
  type: string;
  time: string;
}
export class ShuttleService {
  public getNextShuttle(): ShuttleBus[] {
    const date = new Date();
    if (date.getDay() == 0 || date.getDay() == 6) return [];

    const now = this.toKSTString();

    const type = this.checkTestPeriod() ? 'test' : this.checkVacation() ? 'vacation' : 'normal';
    console.log(now);

    const tmp = shuttleBus.filter((schedule) => {
      schedule.time > now.substr(8, 12) && schedule.type === type;
    });

    var result = [];
    result.push(tmp[0]);
    result.push(tmp[1]);
    console.log('result: ', result);
    return result;
  }

  public getAllShuttle(): ShuttleBus[] {
    return shuttleBus;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addPaddingNumber(number: any): string {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  private toKSTString(): string {
    const now = new Date();

    const result =
      now.getFullYear() +
      '-' +
      this.addPaddingNumber(now.getMonth() + 1) +
      '-' +
      this.addPaddingNumber(now.getDate()) +
      ' ' +
      this.addPaddingNumber(now.getHours()) +
      ':' +
      this.addPaddingNumber(now.getMinutes()) +
      ':' +
      this.addPaddingNumber(now.getSeconds()) +
      '.' +
      (now.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
    return result;
  }

  private checkVacation(): boolean {
    const month = new Date().getMonth();
    if (month == 7 || month == 8 || month == 1 || month == 2) return true;
    else return false;
  }

  private checkTestPeriod(): boolean {

    const now = new Date();
    const today = now.getFullYear() + this.addPaddingNumber(now.getMonth() + 1) + this.addPaddingNumber(now.getDate());

    let flag : boolean = false;

    testPeriod.forEach(function(period) {
      if (today >= period.term.startedAt && today <= period.term.endedAt) {
        flag = true;
      }
    });

    return flag;
  }    
}
