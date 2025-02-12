'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { schema, apiSchema, dailyschema, hourlyschema, weeklySchema, every5minSchema } from './setting-schema';
import { Errors } from './setting-schema';
import { z } from 'zod';
import { collectTypeInfoType } from '../db/settings';

async function settingRemoveAction(id: string) {
  const deleteOptions = { method: 'DELETE' };
  await fetch(`http://elecocean.iptime.org:8061/api/deleteSetting/${id}`, deleteOptions).then((res) => res.json());
}

async function settingFormHandler(
  { type, id }: { type: string; id?: string },
  formState: Errors,
  formData: FormData
): Promise<Errors> {
  const agency = formData.get('agency');
  const collectItem = formData.get('collectItem');
  const collectSchedule = formData.get('collectSchedule');
  const hour = formData.get('hour');
  const minutes = formData.get('minutes');
  const root = formData.get('root');
  const collectType = formData.get('collectType');
  const apiKey = formData.get('apiKey');
  const apiUrl = formData.get('apiUrl');
  const apiStartDate = formData.get('apiStartDate');
  const apiEndDate = formData.get('apiEndDate');
  const apiParamsKey = formData.getAll('apiParamsKey');
  const apiParamsValue = formData.getAll('apiParamsValue');
  const isUsed = formData.get('isUsed');
  const weeks = formData.getAll('weeks');

  let result: any = z.object({ ...schema }).safeParse({
    agency,
    collectItem,
    scheduleType: collectSchedule,
    root,
    collectType,
    isUsed,
  });

  let parse: any = {
    agency,
    collectItem,
    scheduleType: collectSchedule,
    root,
    isUsed: isUsed === 'use' ? true : false,
    collectType,
  };

  let newSetting: any = {
    ...parse,
  };

  const checkSchedule = (typeParse?: collectTypeInfoType) => {
    console.log(collectSchedule);
    if (!collectSchedule) {
      result;
      // } else if (collectSchedule === 'daily') {
    } else if (collectSchedule === '2') {
      // daily
      newSetting = {
        ...newSetting,
        schedule: { hour, minutes },
        collectTypeInfo: { ...typeParse },
      };

      result = z.intersection(z.object({ ...dailyschema }), z.object({ ...apiSchema })).safeParse({ ...newSetting });
      // } else if (collectSchedule === 'weekly') {
    } else if (collectSchedule === '1') {
      // weekly
      newSetting = {
        ...newSetting,
        schedule: {
          hour,
          minutes,
          weeks,
        },
        collectTypeInfo: { ...typeParse },
      };

      result = z.intersection(z.object({ ...weeklySchema }), z.object({ ...apiSchema })).safeParse({ ...newSetting });
      // } else if (collectSchedule === 'hourly') {
    } else if (collectSchedule === '3') {
      // hourly
      newSetting = {
        ...newSetting,
        collectTypeInfo: { ...typeParse },
      };

      result = z.intersection(z.object({ ...hourlyschema }), z.object({ ...apiSchema })).safeParse({ ...newSetting });
    } else if (collectSchedule === '4') {
      //Every 5 minites
      newSetting = {
        ...newSetting,
        collectTypeInfo: { ...typeParse },
      };

      result = z
        .intersection(z.object({ ...every5minSchema }), z.object({ ...apiSchema }))
        .safeParse({ ...newSetting });
    }
  };

  switch (collectType) {
    default:
      checkSchedule();
      break;

    case 'API':
      let parmters: { key: string; value: string }[] = [];
      const apiParse = {
        apiKey: apiKey as string,
        apiUrl: apiUrl as string,
        apiStartDate: apiStartDate as string,
        apiEndDate: apiEndDate as string,
        apiPrmt: parmters,
      };

      apiParamsKey.forEach((el, idx) =>
        parmters.push({
          key: el as string,
          value: apiParamsValue[idx] as string,
        })
      );

      checkSchedule(apiParse);
      break;
  }

  // 수정사항비교
  const compareSetting = async () => {
    newSetting = { ...newSetting, id: parseInt(id as string) };
    const prevSetting = await fetch(`http://192.168.0.152:8093/api/getSetting/${id}`).then((res) => res.json());

    // 박종민 주석처리
    // let newSettingsSort = Object.keys(newSetting)
    //   .sort()
    //   .reduce((obj: any, key) => ((obj[key] = newSetting[key]), obj), {});

    // let prevSettingSort = Object.keys(prevSetting)
    //   .sort()
    //   .reduce((obj: any, key) => ((obj[key] = prevSetting[key]), obj), {});

    // console.log(newSettingsSort);
    // console.log(prevSettingSort);

    // let convertResult = { ...newSettingsSort };

    // for (const key in newSettingsSort) {
    //   if (typeof convertResult[key] === 'object') {
    //     // console.log(convertResult[key]);
    //   }
    // }

    // const compareSetting =
    //   JSON.stringify(prevSettingSort) === JSON.stringify(newSettingsSort);

    // if (compareSetting) return { errors: { _form: '수정된 사항이 없습니다.' } };
  };

  if (type === 'create') {
    const addSettingOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSetting }),
    };

    try {
      await fetch(`http://elecocean.iptime.org:8061/api/addSetting`, addSettingOptions).then((res) => res.json());
    } catch (error) {
      if (error instanceof Error) {
        return { errors: { _form: error.message } };
      } else {
        return { errors: { _form: '잠시 후 다시 시도해주세요.' } };
      }
    }
  } else if (type === 'edit') {
    const editSettingOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSetting }),
    };

    try {
      await fetch(`http://elecocean.iptime.org:8061/api/editSetting/${id}`, editSettingOptions).then((res) =>
        res.json()
      );
    } catch (error) {
      if (error instanceof Error) {
        return { errors: { _form: error.message } };
      } else {
        return { errors: { _form: '잠시 후 다시 시도해주세요.' } };
      }
    }
  }

  if (!result?.success) {
    return { errors: result?.error.flatten().fieldErrors };
  }

  revalidatePath('/cms');
  redirect('/cms');
}

export { settingFormHandler, settingRemoveAction };
