'use client';

import First from '@/public/btnIcon/first.svg';
import Last from '@/public/btnIcon/last.svg';
import Prev from '@/public/btnIcon/prev.svg';
import Next from '@/public/btnIcon/next.svg';
import Dotted from '@/public/btnIcon/dotted.svg';
import Button from '../button';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagenation({
  totalPost, // 총 게시글 수
  totalPages, //총 페이지 수
  postCount, // 페이지당 게시글 수
  pathname,
  page,
}: {
  totalPost: number;
  totalPages: number;
  postCount: number;
  pathname: string;
  page: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchPageRef = useRef<HTMLInputElement>(null);
  const activePage = parseInt(page);
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.toString().split('page')[0];

  function searchPageAction(e: React.FormEvent) {
    e.preventDefault();
    const { value } = searchPageRef.current!;
    router.push(`${pathname}?page=${value}`);
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    if (isOpen) {
      searchPageRef.current!.focus();
    }
  }, [isOpen]);

  // ** 페이지네이션 한 줄 최대 갯수 10페이지
  if (totalPost <= postCount) {
    // 1. 전체 게시글이 한 페이지를 넘기지 않는 경우
    return (
      <div className='pagenation'>
        <ul className='number-group'>
          <li>
            <button className='min active' onClick={(e) => e.preventDefault()}>
              <span>1</span>
            </button>
          </li>
        </ul>
      </div>
    );
  } else if (totalPages <= 10) {
    // 2. 전체 페이지 수가 10개를 넘지 않는 경우
    const pageList = Array.from({ length: totalPages }, (v, i) => i + 1);
    return (
      <div className='pagenation'>
        <ul className='prev-group'>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === 1 ? ' disabled' : ''
              }`}
              title='첫 페이지로'
              href={`${pathname}?${url}page=1`}
              scroll={false}
            >
              <span>첫 페이지로</span>
              <i>
                <First />
              </i>
            </Link>
          </li>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === 1 ? ' disabled' : ''
              }`}
              title='이전 페이지로'
              href={`${pathname}?${url}page=${parseInt(page) - 1}`}
              scroll={false}
            >
              <span>이전 페이지로</span>
              <i>
                <Prev />
              </i>
            </Link>
          </li>
        </ul>
        <ul className='number-group'>
          {pageList.map((el) => {
            return (
              <li key={el}>
                <Link
                  className={`min icon-only${
                    parseInt(page) === el ? ' active' : ''
                  }`}
                  title={JSON.stringify(el) + '페이지로'}
                  href={`${pathname}?${url}page=${el}`}
                  scroll={false}
                >
                  <span>{el}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className='next-group'>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === totalPages ? ' disabled' : ''
              }`}
              title='다음 페이지로'
              href={`${pathname}?${url}page=${parseInt(page) + 1}`}
              scroll={false}
            >
              <span>다음 페이지로</span>
              <i>
                <Next />
              </i>
            </Link>
          </li>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === totalPages ? ' disabled' : ''
              }`}
              title='마지막 페이지로'
              href={`${pathname}?${url}page=${totalPages}`}
              scroll={false}
            >
              <span>마지막 페이지로</span>
              <i>
                <Last />
              </i>
            </Link>
          </li>
        </ul>
      </div>
    );
  } else {
    // 3. 전체 페이지 수가 10개를 넘는 경우
    // 분기점
    // 1) 현재 선택된 페이지가 6보다 작거나 같은 경우 (active가 이동해야 함)
    // 2) 현재 선택된 페이지가 6보다 큰 경우 (선택되는 페이지를 중앙으로 숫자가 바뀌게 할 것)
    // 3) 현재 선택된 페이지가 전체 페이지 - 5보다 크거나 같은 큰 경우
    return (
      <div className='pagenation'>
        <ul className='prev-group'>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === 1 ? ' disabled' : ''
              }`}
              title='첫 페이지로'
              href={`${pathname}?${url}page=1`}
              scroll={false}
            >
              <span>첫 페이지로</span>
              <i>
                <First />
              </i>
            </Link>
          </li>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === 1 ? ' disabled' : ''
              }`}
              title='이전 페이지로'
              href={`${pathname}?${url}page=${parseInt(page) - 1}`}
              scroll={false}
            >
              <span>이전 페이지로</span>
              <i>
                <Prev />
              </i>
            </Link>
          </li>
        </ul>

        <ul className='number-group'>
          <li>
            <Link
              className={`min icon-only ${activePage === 1 ? ' active' : ''}`}
              title={
                activePage <= 5
                  ? JSON.stringify(1) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage - 5) + '페이지로'
                  : JSON.stringify(totalPages - 9) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 1
                  : activePage <= totalPages - 4
                  ? activePage - 5
                  : totalPages - 9
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 1
                  : activePage <= totalPages - 4
                  ? activePage - 5
                  : totalPages - 9}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${activePage === 2 ? ' active' : ''}`}
              title={
                activePage <= 5
                  ? JSON.stringify(2) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage - 4) + '페이지로'
                  : JSON.stringify(totalPages - 8) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 2
                  : activePage <= totalPages - 4
                  ? activePage - 4
                  : totalPages - 8
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 2
                  : activePage <= totalPages - 4
                  ? activePage - 4
                  : totalPages - 8}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${activePage === 3 ? ' active' : ''}`}
              title={
                activePage <= 5
                  ? JSON.stringify(3) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage - 3) + '페이지로'
                  : JSON.stringify(totalPages - 7) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 3
                  : activePage <= totalPages - 4
                  ? activePage - 3
                  : totalPages - 7
              }
              `}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 3
                  : activePage <= totalPages - 4
                  ? activePage - 3
                  : totalPages - 7}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${activePage === 4 ? ' active' : ''}`}
              title={
                activePage <= 5
                  ? JSON.stringify(4) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage - 2) + '페이지로'
                  : JSON.stringify(totalPages - 6) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 4
                  : activePage <= totalPages - 4
                  ? activePage - 2
                  : totalPages - 6
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 4
                  : activePage <= totalPages - 4
                  ? activePage - 2
                  : totalPages - 6}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${activePage === 5 ? ' active' : ''}`}
              title={
                activePage <= 5
                  ? JSON.stringify(5) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage - 1) + '페이지로'
                  : JSON.stringify(totalPages - 5) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 5
                  : activePage <= totalPages - 4
                  ? activePage - 1
                  : totalPages - 5
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 5
                  : activePage <= totalPages - 4
                  ? activePage - 1
                  : totalPages - 5}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${
                activePage > 5 && activePage < totalPages - 3 ? ' active' : ''
              }`}
              title={
                activePage <= 5
                  ? JSON.stringify(6) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage) + '페이지로'
                  : JSON.stringify(totalPages - 4) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 6
                  : activePage <= totalPages - 4
                  ? activePage
                  : totalPages - 4
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 6
                  : activePage <= totalPages - 4
                  ? activePage
                  : totalPages - 4}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${
                activePage === totalPages - 3 ? ' active' : ''
              }`}
              title={
                activePage <= 5
                  ? JSON.stringify(7) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage + 1) + '페이지로'
                  : JSON.stringify(totalPages - 3) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 7
                  : activePage <= totalPages - 4
                  ? activePage + 1
                  : totalPages - 3
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 7
                  : activePage <= totalPages - 4
                  ? activePage + 1
                  : totalPages - 3}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${
                activePage === totalPages - 2 ? ' active' : ''
              }`}
              title={
                activePage <= 5
                  ? JSON.stringify(8) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage + 2) + '페이지로'
                  : JSON.stringify(totalPages - 2) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 8
                  : activePage <= totalPages - 4
                  ? activePage + 2
                  : totalPages - 2
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 8
                  : activePage <= totalPages - 4
                  ? activePage + 2
                  : totalPages - 2}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${
                activePage === totalPages - 1 ? ' active' : ''
              }`}
              title={
                activePage <= 5
                  ? JSON.stringify(9) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage + 3) + '페이지로'
                  : JSON.stringify(totalPages - 1) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 9
                  : activePage <= totalPages - 4
                  ? activePage + 3
                  : totalPages - 1
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 9
                  : activePage <= totalPages - 4
                  ? activePage + 3
                  : totalPages - 1}
              </span>
            </Link>
          </li>
          <li>
            <Link
              className={`min icon-only ${
                activePage === totalPages ? ' active' : ''
              }`}
              title={
                activePage <= 5
                  ? JSON.stringify(10) + '페이지로'
                  : activePage <= totalPages - 4
                  ? JSON.stringify(activePage + 4) + '페이지로'
                  : JSON.stringify(totalPages) + '페이지로'
              }
              href={`${pathname}?${url}page=${
                activePage <= 5
                  ? 10
                  : activePage <= totalPages - 4
                  ? activePage + 4
                  : totalPages
              }`}
              scroll={false}
            >
              <span>
                {activePage <= 5
                  ? 10
                  : activePage <= totalPages - 4
                  ? activePage + 4
                  : totalPages}
              </span>
            </Link>
          </li>
          <li>
            <button
              className={`search-page min icon-only `}
              onClick={(e) => {
                searchPageRef.current!.focus();
                e.preventDefault();
                setIsOpen((prev) => !prev);
              }}
            >
              <span className='hide'>검색하기</span>
              <i className='icon'>
                <Dotted />
              </i>
            </button>
            <div className={`search-modal${isOpen ? ' open' : ''}`}>
              <form onSubmit={(e) => searchPageAction(e)}>
                <input
                  type='number'
                  min='1'
                  max={totalPages}
                  ref={searchPageRef}
                  defaultValue={activePage}
                  id='searchPage'
                />
                / {totalPages}
                <Button label='이동' size='min' />
              </form>
            </div>
          </li>
        </ul>

        <ul className='next-group'>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === totalPages ? ' disabled' : ''
              }`}
              title='다음 페이지로'
              href={`${pathname}?${url}page=${parseInt(page) + 1}`}
              scroll={false}
            >
              <span>다음 페이지로</span>
              <i>
                <Next />
              </i>
            </Link>
          </li>
          <li>
            <Link
              className={`btn min icon-only${
                activePage === totalPages ? ' disabled' : ''
              }`}
              title='마지막 페이지로'
              href={`${pathname}?${url}page=${totalPages}`}
              scroll={false}
            >
              <span>마지막 페이지로</span>
              <i>
                <Last />
              </i>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}
