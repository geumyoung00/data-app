'use server';

export type dataType = {
  id: number;
  settingId: number;
  agency: string;
  agency_kor: string;
  collectItem: string;
  root: string;
  collectType: string;
  date: string;
  time: string;
  state: string;
  log: string;
};

type SearchDataErrors = {
  errors: undefined | { _form?: string };
  filterd?: dataType[];
};

async function fetchData() {
  const response = await fetch('http://elecocean.iptime.org:8061/api/data', {
    cache: 'no-store',
  });
  return response.json();
}

async function fetchMonthData(startDate: string, endDate: string) {
  const results = await fetch(
    `http://elecocean.iptime.org:8061/api/data/?date_gte=${startDate}&date_lte=${endDate}`
  ).then((res) => res.json());

  return results;
}

async function fetchSearchData(
  formstate: SearchDataErrors,
  formData: FormData
): Promise<SearchDataErrors> {
  const searchAgency = formData.get('searchAgency');
  const searchStartDate = formData.get('searchStartDate');
  const searchEndDate = formData.get('searchEndDate');
  let result: dataType[];

  switch (searchAgency) {
    case 'all':
      if (!searchStartDate && !searchEndDate) {
        const response = await fetch(
          'http://elecocean.iptime.org:8061/api/data',
          {
            cache: 'no-store',
          }
        );

        return response.json();
      }
      if (!searchStartDate) {
        result = await fetch(`http://elecocean.iptime.org:8061/api/data`).then(
          (res) => res.json()
        );
        return { errors: undefined, filterd: result };
      }

      if (searchStartDate && !searchEndDate)
        return { errors: { _form: '검색 종료일은 오늘 날짜로 설정됩니다.' } };

      result = await fetch(
        `http://elecocean.iptime.org:8061/api/data/?date_gte=${searchStartDate}&date_lte=${searchEndDate}`
      ).then((res) => res.json());

      if (result.length < 1)
        return { errors: { _form: '검색 결과가 없습니다.' } };

      return { errors: undefined, filterd: result };

    default:
      if (!searchStartDate) {
        result = await fetch(
          `http://elecocean.iptime.org:8061/api/data/?agency=${searchAgency}`
        ).then((res) => res.json());
      } else {
        result = await fetch(
          `http://elecocean.iptime.org:8061/api/data/?agency=${searchAgency}&date_gte=${searchStartDate}&date_lte=${searchEndDate}`
        ).then((res) => res.json());
      }

      if (result.length < 1)
        return { errors: { _form: '검색 결과가 없습니다.' } };

      return { errors: undefined, filterd: result };
  }
}

async function fetchDatabyId(id: string) {
  const response = fetch(`http://elecocean.iptime.org:8061/api/data/${id}`);
  const results = (await response).json();
  return results;
}

export { fetchData, fetchSearchData, fetchDatabyId, fetchMonthData };
