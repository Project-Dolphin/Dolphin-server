export function toKSTString(): string {
    const now = new Date();

    const result =
        now.getFullYear() +
        addPaddingNumber(now.getMonth() + 1) +
        addPaddingNumber(now.getDate()) +
        addPaddingNumber(now.getHours()) +
        addPaddingNumber(now.getMinutes()) +
        addPaddingNumber(now.getSeconds())
    return result;
}

export function addPaddingNumber(number: any): string {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

export function checkHoliday(): boolean {
    //const today = toKSTString().substr(0, 8);
    var flag = false;
    return flag;
}