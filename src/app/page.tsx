'use client';

import Link from 'next/link';
import InputText from '../components/form/inputText';
import Button from '@/src/components/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [error, setError] = useState<{ error: boolean; message: '' }>();
  const router = useRouter();
  const regex = /^[a-zA-Z0-9]*$/;

  const signHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const id = formData.get('signId');
    const password = formData.get('signPw');

    router.replace('/view');
  };

  return (
    <>
      <div className='contain login'>
        <h3 className='hide'>로그인페이지</h3>
        <div className='sign'>
          <form onSubmit={(e) => signHandler(e)}>
            <div className='id'>
              <p className='input-title'>아이디</p>
              <InputText label='signId' hide='hide'>
                <input type='text' id='signId' name='signId' placeholder='ID를 입력해주세요' />
              </InputText>
            </div>
            <div className='password'>
              <p className='input-title'>비밀번호</p>
              <InputText label='signPw' hide='hide'>
                <input type='password' id='signPw' name='signPw' placeholder='비밀번호를 입력해주세요' />
              </InputText>
            </div>
            <Button label='로그인' />
          </form>
        </div>
      </div>
    </>
  );
}
