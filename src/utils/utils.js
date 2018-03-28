import Vue from 'vue';

export const eventBus = new Vue();

export const removeDuplicates = (array, property) => {
  let uniq = new Set();
  return array.filter(item => {
    let isUniq = !uniq.has(item[property]);
    uniq.add(item[property]);
    return isUniq;
  });
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function serializeGetParams(params) {
  let str = '';
  for (let key in params) {
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(params[key]);
  }
  return str;
}
