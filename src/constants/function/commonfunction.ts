import { holiDay } from "../holiday";

export function toKSTString(): string {
    const now = makeKoreaDate();

    //const now = new Date('2021/08/09/22:38:10'); // 야간용 시간 코드
    //const now = new Date('2021/08/15/14:00:00'); // 공휴일용 시간 코드
    //const now = new Date('2021/12/11/14:00:00'); // 시험기간용 시간 코드

    const result =
        now.getFullYear() +
        addPaddingNumber(now.getMonth() + 1) +
        addPaddingNumber(now.getDate()) +
        addPaddingNumber(now.getHours()) +
        addPaddingNumber(now.getMinutes()) +
        addPaddingNumber(now.getSeconds());

    return result;
}

export function addPaddingNumber(number: number): string {
    if (number < 10) {
        return '0' + String(number);
    }
    return String(number);
}

export function checkHoliday(): boolean {

    const now = toKSTString().substr(0, 8);

    var flag = false;

    holiDay.forEach(function (period) {
        if (now >= period.term.startedAt && now <= period.term.endedAt) {
            flag = true;
        }
    });

    return flag;
}

export function makeKoreaDate(): Date {
    const newDate = new Date('2021/12/11/05:00:00');
    newDate.setTime(newDate.getTime() + 9 * 60 * 60 * 1000);
    return newDate;
}