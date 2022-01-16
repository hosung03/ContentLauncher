import * as moment from 'moment';

// tslint:disable-next-line
export const formattedString = (...args: any[]) => {
  // The string containing the format items (e.g. '{0}')
  // will and always has to be the first argument.
  let theString = args[0];
  // start with the second argument (i = 1)
  for (let i = 1; i < args.length; i += 1) {
    // 'gm' = RegEx options for Global search (more than one instance)
    // and for Multiline search
    const regEx = new RegExp(`\\{${i - 1}\\}`, 'gm');
    theString = theString.replace(regEx, args[i]);
  }
  return theString;
};

export const convertCodeToSeq = (code: string) => {
  return Number(code.slice(code.length - 4, code.length));
};

export const convertSecToTime = (sec: number) => {
  const hour = Math.floor(sec / 3600);
  const remainSec = sec - hour * 3600;
  const min = Math.floor(remainSec / 60);
  const second = remainSec - min * 60;
  return { hour, min, second };
};

export const convertMilSecToTime = (milsec: number) => {
  const sec = milsec / 1000;
  const hour = Math.floor(sec / 3600);
  const remainSec = sec - hour * 3600;
  const min = Math.floor(remainSec / 60);
  const second = Math.floor(remainSec - min * 60);
  const milSec = Math.floor(sec * 100 - Math.floor(sec) * 100);
  return { hour, min, second, milSec };
};

export const pad = (n: number, width: number) => {
  const nStr = n + '';
  return nStr.length >= width ? nStr : new Array(width - nStr.length + 1).join('0') + nStr;
};

// tslint:disable-next-line
export const shuffleArray = (arr: Array<any>) => {
  return arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const convertUnixTime = (unixTime: number, outputFormat = 'YYYY/MM/DD') => {
  return moment(unixTime, 'X').format(outputFormat);
};

export const checkEmptyString = (text: string) => {
  if (text.length === 0) {
    return true;
  }

  for (let i = 0; i < text.length; ++i) {
    if (text.charAt(i) !== ' ') return false;
  }

  return true;
};

export const convertDateTimeToUnixTime = (dateTime: string) => {
  const date = moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
  if (date.isValid()) return Number(date.format('X'));

  console.error('invalid date format. use current time');
  return Number(moment().format('X'));
};

export const getRandomFloat = (min: number, max: number) => {
  return Math.random() * (max - min + 1) + min;
};

// KimCG Updated
export const currentTimeStamp = () => {
  return Number(moment().format('x'));
};

// tslint:disable-next-line
export const flatten = (items: any[]) => {
  // tslint:disable-next-line
  const flat: any = [];
  items.forEach(item => {
    if (Array.isArray(item)) {
      flat.push(...flatten(item));
    } else {
      flat.push(item);
    }
  });

  return flat;
};

export const delay = (delayMilSec: number) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), delayMilSec));
};

// tslint:disable-next-line
export const unique = (arrayList: Array<any>) => {
  return Array.from(new Set(arrayList));
};