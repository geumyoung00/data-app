const scheduleType = [
  { id: 'weekly', name: '매주', seq: '1' },
  { id: 'daily', name: '매일', seq: '2' },
  { id: 'hourly', name: '1시간마다', seq: '3' },
  { id: 'every5min', name: '5분마다', seq: '4' },
];

const timeArr = [...new Array(25)].map((_, i) => {
  if (i < 10) return '0' + JSON.stringify(i * 1);
  return JSON.stringify(i * 1);
});

const minuteArr = [...new Array(12)].map((_, i) => {
  if (i * 5 < 10) return '0' + JSON.stringify(i * 5);
  return JSON.stringify(i * 5);
});

const weekArr = [
  { id: '1', name: '월' },
  { id: '2', name: '화' },
  { id: '3', name: '수' },
  { id: '4', name: '목' },
  { id: '5', name: '금' },
  { id: '6', name: '토' },
  { id: '7', name: '일' },
];

const useOption = [
  {
    label: '사용',
    name: 'isUsed',
    value: 'use',
    checked: true,
  },
  {
    label: '미사용',
    name: 'isUsed',
    value: 'unused',
    checked: false,
  },
];

const unuseOption = [
  {
    label: '사용',
    name: 'isUsed',
    value: 'use',
    checked: false,
  },
  {
    label: '미사용',
    name: 'isUsed',
    value: 'unused',
    checked: true,
  },
];

export { scheduleType, timeArr, minuteArr, weekArr, useOption, unuseOption };
