'use client';

import Arrow from '@/public/arrow.svg';

export default function TableTop({
  pageInfo,
  viewCountHandler,
}: {
  pageInfo: { page: number; totalPages: number };
  viewCountHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className='top'>
      <h3 className='hide'>테이블 데이터명</h3>
      <legend>
        <span>{pageInfo.page} 페이지</span> / 총 {pageInfo.totalPages} 페이지
      </legend>
      <div className='view-select'>
        <div className='select min'>
          <select
            name='viewCount'
            id='viewCount'
            onChange={(e) => viewCountHandler(e)}
          >
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>30</option>
          </select>
          <i className={`arrow`}>
            <Arrow />
          </i>
        </div>
        <label htmlFor='viewCount'>개 보기</label>
      </div>
    </div>
  );
}
