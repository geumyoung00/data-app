'use client';

import React, { useEffect, useState } from 'react';
import Pagenation from './pagenation';
import TableTop from './tableTop';
import Button from '../button';
import { settingType } from '@/src/db/settings';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { settingRemoveAction } from '@/src/action/setting-form-action';
import Link from 'next/link';

export default function CmsTable({ settings }: { settings: settingType[] }) {
  const [postCount, setPostCount] = useState<number>(5); //보여줄 게시글 수
  const [now, setNow] = useState<number>(1); // 선택된 페이지(현재)
  const router = useRouter();
  const pathname = usePathname();
  const page = useSearchParams().get('page');
  let startIdx: number = (now - 1) * postCount; //선택 페이지의 시작 게시글의 인덱스
  const posts = settings.slice(startIdx, startIdx + postCount); // 선택된 갯수만큼 보여질 게시글 목록
  const totalPages = Math.ceil(settings.length / postCount);

  useEffect(() => {
    if (!page) setNow(1);
    else if (parseInt(page) > totalPages) {
      router.push(`/cms`);
    } else setNow(parseInt(page));
  }, [page, router, totalPages]);

  const viewCountHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const changeTotalPages = Math.ceil(settings.length / parseInt(e.target.value));
    if (changeTotalPages < now) setNow(changeTotalPages);
    setPostCount(parseInt(e.target.value));
  };

  const removeSettingHandler = (id: string) => {
    if (confirm(`정말 ${id} 설정을 삭제하시겠습니까?`)) settingRemoveAction(id);
    window.location.reload();
    router.push(`/cms?page=${id}`);
    return;
  };

  let itemIdx = startIdx;

  return (
    <div className='table'>
      <TableTop viewCountHandler={(e) => viewCountHandler(e)} pageInfo={{ page: now, totalPages: totalPages }} />
      <table>
        <colgroup>
          <col width={'72px'} />
          <col width={'12%'} />
          <col width={'11%'} />
          <col width={'10%'} />
          <col width={'13%'} />
          <col />
          <col width={'12%'} />
          <col width={'13%'} />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>기관</th>
            <th>수집내용</th>
            <th>수집형태</th>
            <th>수집 스케줄</th>
            <th>수집폴더</th>
            <th>사용여부</th>
            <th>더보기</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((el, idx) => {
            const agency = JSON.parse(el.agency);
            const { collectType } = el;
            const collectItem = JSON.parse(el.collectItem);
            const { schedule } = el;
            const jsonStr: string = JSON.stringify(schedule);
            const strJson = JSON.parse(jsonStr);
            const { hour, minutes } = JSON.parse(strJson);
            const weeksArr = JSON.parse(strJson).weeks;
            let weeks: string[] = [];
            let newWeek: string[] = [];
            weeksArr?.split('|').forEach((el: any) => {
              newWeek.push(el);
            });
            newWeek.forEach((el: any) => {
              el === '1'
                ? weeks.push('월')
                : el === '2'
                ? weeks.push('화')
                : el === '3'
                ? weeks.push('수')
                : el === '4'
                ? weeks.push('목')
                : el === '5'
                ? weeks.push('금')
                : el === '6'
                ? weeks.push('토')
                : el === '7'
                ? weeks.push('일')
                : '';
            });

            const scheduleType =
              el.scheduleType === '3'
                ? '매시간'
                : el.scheduleType === '2' && !schedule.weeks
                ? '매일'
                : el.scheduleType === '1'
                ? '매주'
                : el.scheduleType === '4'
                ? '5분 마다'
                : '';

            itemIdx++;

            return (
              <tr key={idx}>
                <td>{itemIdx}</td>
                <td>{agency.name}</td>
                <td>{collectItem.name}</td>
                <td>{collectType}</td>
                <td>
                  {`${scheduleType}
                  ${weeks.length > 0 ? `${weeks}요일` : weeks.length > 0 ? `${weeks.join(',')}요일` : ''}
                  ${hour ? `${hour} : ` : ''}${minutes}`}
                </td>
                <td>{el.root}</td>
                <td>
                  {el.isUsed ? (
                    <div className={`tag`}>
                      <span>사용중</span>
                    </div>
                  ) : (
                    <div className={`tag stop`}>
                      <span>사용중지</span>
                    </div>
                  )}
                </td>
                <td>
                  <div className='btn-group'>
                    <Link href={`/cms/edit/${el.id}`} className='btn min secondary'>
                      <span>수정</span>
                    </Link>
                    <Button label='삭제' state='tertiary' size='min' onClick={() => removeSettingHandler(el.id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagenation
        totalPost={settings.length}
        totalPages={totalPages}
        postCount={postCount}
        pathname={pathname}
        page={!page ? '1' : page}
      />
    </div>
  );
}
