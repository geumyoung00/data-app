'use client';

import Button from '@/src/components/button';
import { dataType, fetchDatabyId } from '@/src/db/data';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [nowData, setNowData] = useState<dataType>();
  const router = useRouter();

  useEffect(() => {
    fetchDatabyId(id).then((res) => setNowData(res[0]));
  }, []);

  const movePage = (e: unknown) => router.push('/view');

  const parseDate = new Date(nowData?.date as string).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const parseTime = new Date(
    ((nowData?.date as string) + 'T' + nowData?.time) as string
  ).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  return (
    <div className='contain'>
      <h2 className='sub-title'>
        {nowData?.agency_kor} / {nowData?.collectItem} 수집 상세 정보
      </h2>
      <div className='data-info'>
        <dl>
          <dt>수집 기관</dt>
          <dd>{nowData?.agency_kor}</dd>
        </dl>
        <dl>
          <dt>수집 항목</dt>
          <dd>{nowData?.collectItem}</dd>
        </dl>
        <dl>
          <dt>수집 시간</dt>
          <dd>
            {parseDate} {parseTime}
          </dd>
        </dl>
        <dl>
          <dt>수집 상태</dt>
          <dd>
            <div className={`tag ${nowData?.state}`}>
              <span>
                {nowData?.state === 'success'
                  ? '수집성공'
                  : nowData?.state === 'faild'
                  ? '수집 실패'
                  : '수집 중'}
              </span>
            </div>
          </dd>
        </dl>
        <div className='logbox'>
          <textarea name='' id='' value={nowData?.log!} readOnly></textarea>
        </div>
        <Button label='목록으로' onClick={(e) => movePage(e)} />
      </div>
    </div>
  );
}
