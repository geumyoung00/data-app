'use server';

export interface collectTypeInfoType {
  apiKey?: string;
  apiUrl?: string;
  apiEndDate?: string;
  apiStartDate?: string;
  apiPrmt?: { key: string; value: string }[];
}

export interface scheduleInfoType {
  hour?: string;
  minutes?: string;
  weeks?: string;
}

export interface settingType {
  id: string;
  agency: string;
  collectTypeInfo: collectTypeInfoType;
  collectItem: string;
  scheduleType: string;
  schedule: scheduleInfoType;
  root: string;
  collectType: string;
  isUsed: boolean;
}

export type radioType = {
  label: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

type SearchSettingErrors = {
  errors: undefined | { _form?: string };
  filterd?: settingType[];
};

async function fetchSettings() {
  const response = await fetch(
    'http://elecocean.iptime.org:8061/api/getSetting',
    {
      cache: 'no-store',
    }
  );
  return response.json();
}

async function fetchSearchSettings(
  formstate: SearchSettingErrors,
  formData: FormData
): Promise<SearchSettingErrors> {
  const searchAgency = formData.get('searchAgency') as string;
  const searchKeyword = formData.get('searchKeyword') as string;
  let result: settingType[];

  switch (searchAgency) {
    case 'all':
      if (!searchKeyword) {
        result = await fetch(
          `http://elecocean.iptime.org:8061/api/getSetting`,
          {
            cache: 'no-cache',
          }
        ).then((res) => res.json());
        return { errors: undefined, filterd: result };
      }

      result = await fetch(
        `http://elecocean.iptime.org:8061/api/getSetting?keyword=${searchKeyword}`,
        {
          cache: 'no-cache',
        }
      ).then((res) => res.json());
      break;

    default:
      result = await fetch(
        `http://elecocean.iptime.org:8061/api/getSetting?agency=${searchAgency}${
          searchKeyword ? `&keyword=${searchKeyword}` : ''
        }`,
        {
          cache: 'no-cache',
        }
      ).then((res) => res.json());
      break;
  }

  if (result.length < 1) return { errors: { _form: '검색 결과가 없습니다.' } };

  return { errors: undefined, filterd: result };
}

export { fetchSettings, fetchSearchSettings };
