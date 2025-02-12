'use client';

import DatePicker from '@/src/components/form/datePicker';
import Select from '@/src/components/form/select';
import Button from '@/src/components/button';
import ViewTable from '@/src/components/table/viewTable';
import Charts from '@/src/components/Charts';
import { Suspense, useEffect, useRef, useState } from 'react';
import { agencyType, fetchAgencies } from '@/src/db/agencies';
import { dataType, fetchMonthData, fetchSearchData } from '@/src/db/data';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

export type chartsDataType = {
  agency: agencyType;
  success: number;
  faild: number;
};

export default function View() {
  const today = new Date().toISOString().split('T')[0];
  const onMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .split('T')[0];

  const [datas, setDatas] = useState<dataType[]>([]);
  const [searchStartDate, setSearchStartDate] = useState<string>(onMonthAgo);
  const [searchEndDate, setSearchEndDate] = useState<string>(today);
  const [agencies, setAgencies] = useState<agencyType[]>([
    { id: 'all', name: '전체' },
  ]);
  const [chartsData, setChartsData] = useState<chartsDataType[]>([
    {
      agency: { id: 'all', name: '전체' },
      success: 0,
      faild: 0,
    },
  ]);

  const [formState, dataFormHandler] = useFormState(fetchSearchData, {
    errors: {},
  });
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const startDate = startRef.current?.value;
  const endDate = endRef.current?.value;
  const selectAgency = selectRef.current?.value;
  const router = useRouter();

  let initFilterArr = (agencies: agencyType[]) =>
    agencies.map((agency) => ({
      agency,
      success: 0,
      faild: 0,
    }));

  const processChartData = (datas: dataType[], agencies: agencyType[]) => {
    const filterArr = initFilterArr(agencies);
    let totalFilter = filterArr[0];

    datas.forEach((data) => {
      const idx = filterArr.findIndex((el) => el.agency.id === data.agency);

      if (data.state === 'success') {
        filterArr[idx].success += 1;
        totalFilter.success += 1;
      } else if (data.state === 'faild') {
        filterArr[idx].faild += 1;
        totalFilter.faild += 1;
      }
    });

    return filterArr;
  };

  const loadInitData = async () => {
    let fetchingAgencies = await fetchAgencies();
    const processAgencies = agencies.concat(fetchingAgencies);
    setAgencies(processAgencies);

    const initData = await fetchMonthData(searchStartDate, searchEndDate);
    const countedChartData = processChartData(initData, processAgencies);

    setDatas(initData);
    setChartsData(countedChartData);
  };

  useEffect(() => {
    loadInitData();
  }, [router]);

  useEffect(() => {
    if (formState.errors?._form) {
      alert(formState.errors._form);
      formState.errors._form = '';
    }
    if (formState.errors?._form && !endDate) endRef.current!.value = today;

    if (!formState.errors?._form && selectAgency)
      endDate && startDate
        ? router.push(
            `/view/?agency=${selectAgency}&startDate=${startDate}&endDate=${endDate}&page=1`
          )
        : router.push(`/view/?agency=${selectAgency}&page=1`);

    if (formState.filterd) {
      setDatas(formState.filterd);

      const countedChartData = processChartData(formState.filterd, agencies);
      setChartsData(countedChartData);
    }
  }, [formState, startDate, today, selectAgency, router, endDate]);

  const searchStartDateHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchStartDate(e.target.value);

  const searchEndDateHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchEndDate(e.target.value);

  //데이터 관리는 리덕스 써야 함 ***
  return (
    <div className='contain'>
      <form action={dataFormHandler}>
        <ul className='filter-bar'>
          <li>
            <Select forLabel='searchAgency' label='기관 선택'>
              <select id={'searchAgency'} name={'searchAgency'} ref={selectRef}>
                {agencies?.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </Select>
          </li>
          <li>
            <p className='label'>기간 선택</p>
            <DatePicker hide='hide' label='searchStartDate'>
              <input
                type='date'
                name='searchStartDate'
                id='searchStartDate'
                max={today}
                ref={startRef}
                onChange={(e) => searchStartDateHandler(e)}
                value={searchStartDate}
              />
            </DatePicker>
            <p className='text'>~</p>
            <DatePicker hide='hide' label='searchEndDate'>
              <input
                type='date'
                name='searchEndDate'
                id='searchEndDate'
                max={today}
                min={searchStartDate}
                ref={endRef}
                onChange={(e) => searchEndDateHandler(e)}
                value={searchEndDate}
              />
            </DatePicker>
          </li>
          <li>
            <Button label='검색' />
          </li>
        </ul>
      </form>
      <div className='charts'>
        {chartsData?.map((data) => {
          return <Charts key={data.agency.id} countData={data} />;
        })}
      </div>
      <Suspense>
        <ViewTable datas={datas} />
      </Suspense>
    </div>
  );
}
