import { shuttleBus } from '../constants/shuttle';

export class ShuttleService {
  public getShuttleNext() {
    const date = new Date();
    if(date.getDay() == 0 || date.getDay() == 6) return 0;

    const now = this.toKSTString();

    var type = this.chkVacatgion() ? 'vacation' : 'normal';

    const tmp = shuttleBus
      .filter(schedule => { schedule.time > now.substr(8,12) && schedule.type === type});

    var result = [];
    result.push(tmp[0]);
    result.push(tmp[1]);

    return result;
  }

  public getShuttleAll() {

    return shuttleBus;
  }

  toKSTString = function (): string {
    const now = new Date();
    function pad(number : any) {
      if (number < 10) {
          return "0" + number;
      }
      return number;
    }
    return now.getFullYear() +
      "-" + pad(now.getMonth() + 1) +
      "-" + pad(now.getDate()) +
      " " + pad(now.getHours()) +
      ":" + pad(now.getMinutes()) +
      ":" + pad(now.getSeconds()) +
      "." + (now.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
  }

  chkVacatgion = function () {
    var month = new Date().getMonth();
    if( month == 7 || month == 8 || month == 1 || month == 2) return true
    else return false;
  }
}
