'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/src/scss/_header.scss';
import Setting from '@/public/setting.svg';
import Auth from '@/public/singout.svg';
import View from '@/public/view.svg';
import AlarmModal from './modal/alarmModal';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [haveToken, setHaveToken] = useState(false);

  // useEffect(() => {
  //   if (pathname.length > 1) return setHaveToken(true);
  //   setHaveToken(false);
  // }, [pathname]);

  return (
    <div className='header'>
      <h1>
        <Link href={'/'} title='홈으로'>
          {pathname.includes('cms') ? '자료 수집 설정' : '자료 수집 현황'}
        </Link>
      </h1>
      {haveToken ? (
        <ol className='user-menu'>
          <AlarmModal />
          <li className='setting'>
            {pathname.includes('/cms') ? (
              <Link
                className='menu-btn'
                href={'/view'}
                title='자료 수집 시스템 바로가기'
              >
                <p className='hide'>자료 수집 시스템 바로가기</p>
                <i>
                  <View />
                </i>
              </Link>
            ) : (
              <Link
                className='menu-btn'
                href={'/cms'}
                title='자료 수집 설정 바로가기'
              >
                <p className='hide'>자료 수집 설정 바로가기</p>
                <i>
                  <Setting />
                </i>
              </Link>
            )}
          </li>
          <li className='auth '>
            <button className='menu-btn'>
              <p>사용자명</p>
              <i>
                <Auth />
              </i>
            </button>
          </li>
        </ol>
      ) : (
        <ol className='user-menu'>
          <li className='setting not-token'>
            {pathname.includes('/cms') ? (
              <>
                <Link
                  className='menu-btn'
                  href={'/view'}
                  title='자료 수집 시스템 바로가기'
                >
                  <i>
                    <View />
                  </i>
                </Link>
              </>
            ) : pathname.includes('/view') ? (
              <>
                <Link
                  className='menu-btn'
                  href={'/cms'}
                  title='자료 수집 설정 바로가기'
                >
                  <i>
                    <Setting />
                  </i>
                </Link>
              </>
            ) : (
              ''
            )}
          </li>
        </ol>
      )}
    </div>
  );
}
