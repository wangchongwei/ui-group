/** 从string类型的时间文本中获取日期格式 example： 2018-11-23  | 2018-11-23 10：29：30 */
export function getDateForStr(dateStr: string, needSecond: boolean = false) {
    const str = dateStr.toString().replace(/-|:|\/| /g, '');
    const strLength = str.length;
    if(strLength < 8) {
        console.warn('传入的时间文本格式错误！！！');
        return;
    }
    if(strLength < 14 && needSecond) {
        console.warn('需要秒，但是传入的文本中不含秒，如需默认为0，请先在传入的字符中填充0!!');
        return;
    }
    const year = parseInt(str.substring(0, 4));
    const month = parseInt(str.substring(4, 6)) - 1;
    const day = parseInt(str.substring(6, 8));
    let hour = 0;
    let minute = 0;
    let second = 0;
    if(needSecond) {
        hour = parseInt(str.substring(8, 10));
        minute = parseInt(str.substring(10, 12));
        second = parseInt(str.substring(12, 14));
    }
    const date = new Date(year, month, day, hour, minute, second);
    return date;
}

/** 对时间对象做格式化, 因为Date对象的format方法已经遗弃 */
export function format(date: Date, format: string) {
    let newDate = new Date();
    if(typeof(date) === 'string') {
        newDate = getDateForStr(date, date.length > 13);
    } else {
        newDate = date;
    }
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    const second = newDate.getSeconds();

    const dateStr = format.replace('YYYY', year).replace('MM', month).replace('DD', day).replace('hh', hour).replace('mm', minute).replace('ss', second);
    return dateStr;
}

/** 获取当前时间后的某一个时间 */
export function getDate (addTime: number, timeType: 1|2|3|4|5|6): Date {
    const timeadd = parseInt(addTime);
    const newDate = new Date();
    let year = newDate.getFullYear();
    let month = newDate.getMonth();
    let day = newDate.getDate();
    let hour = newDate.getHours();
    let minute = newDate.getMinutes();
    let second = newDate.getSeconds();

    switch(timeType) {
        
        case 1:
            year += timeadd;
            break;

        case 2:
            month += timeadd;
            break;

        case 3:
            day += timeadd;
            break;

        case 4:
            hour += timeadd;
            break;

        case 5:
            minute += timeadd;
            break;

        case 6:
            second += timeadd;
            break;

        default:
            break;
    }
    const date = new Date(year, month, day, hour, minute, second);
    return date;
}