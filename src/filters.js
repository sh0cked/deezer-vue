import moment from 'moment';

const REPLACER_PATTERN = /(.)(?=(\d{3})+$)/g;

export const playsCountFilter = value => {
  if (value < 1000) return value;
  return String(value).replace(REPLACER_PATTERN, '$1,');
};

export const playsCountShortFilter = value => {
  if (value < 1000) return value;
  let str = String(value);
  return value < 1000000
    ? `${str.slice(0, str.length - 3)}K`
    : `${str.slice(0, str.length - 6)}M`;
};

export const trackTime = (time, unit) => {
  if (typeof time !== 'number' || !time) {
    return '0:00';
  }
  // HTMLAudioElement provides time in seconds
  if (unit === 'ms') {
    time /= 1000; // convert milliseconds to seconds
  }
  let hours = Math.floor(time / 3600);
  let minutes = `${Math.floor((time % 3600) / 60)}`.slice(-2);
  let seconds = `0${Math.floor(time % 60)}`.slice(-2);
  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
};

export const timePassed = date => {
  return moment(date).format('d MMMM Y');
};
