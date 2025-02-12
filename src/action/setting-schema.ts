import { z } from 'zod';

export interface Errors {
  errors: ErrorsType | undefined;
}

export type ErrorsType = {
  agency?: string[];
  collectItem?: string[];
  root?: string[];
  scheduleType?: string[];
  schedule?: string[];
  collectSchedule?: string[];
  collectType?: string[];
  collectTypeInfo?: string[];
  isUsed?: string[];
  _form?: string;
};

const schema = {
  agency: z.string().min(1, { message: '수집 기관을 선택하세요.' }),
  collectItem: z.string().min(1, { message: '수집 항목을 선택하세요.' }),
  scheduleType: z.string().min(1, { message: '수집 스케줄을 선택하세요.' }),
  root: z
    .string()
    .min(1, { message: '수집 폴더를 입력하세요.' })
    .regex(/^(?=.*[a-zA-Z])|(?=.*[/])|(?=.*[0-9])$/, '영문 또는 숫자만 입력가능합니다.'),
  collectType: z.string().min(1, { message: '수집 형태를 선택하세요.' }),
};

const scheduleSchema = {
  hour: z.string().min(1, { message: '수집 시간을 선택하세요.' }),
  minutes: z.string().min(1, { message: '수집 분을 선택하세요.' }),
};

const dailyschema = {
  schedule: z.object(scheduleSchema),
  ...schema,
};

const hourlyschema = { ...schema };

const every5minSchema = { ...schema };

const weeklySchema = {
  schedule: z.object({
    weeks: z.array(z.string()).nonempty({ message: '요일을 선택하세요.' }),
    ...scheduleSchema,
  }),
  ...schema,
};

const apiSchema = {
  collectTypeInfo: z.object({
    apiKey: z.string().min(1, { message: 'API의 key를 입력하세요.' }),
    apiUrl: z.string().min(1, { message: 'API의 URL을 입력하세요.' }),
    apiStartDate: z.string().min(1, { message: 'API 유효기간의 시작일을 선택하세요' }),
    apiEndDate: z.string().min(1, { message: 'API 유효기간의 종료일을 선택하세요.' }),
    apiPrmt: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .min(1, { message: '파라미터는 반드시 하나 이상 등록되어야 합니다.' }),
  }),
};

export { schema, apiSchema, dailyschema, hourlyschema, weeklySchema, every5minSchema };
