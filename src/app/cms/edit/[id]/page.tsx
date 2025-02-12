'use client';

import { MngProvider } from '@/src/store/mngProvider';
import EditSettingForm from './editForm';

export default function EditPage() {
  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 설정 수정</h2>
      <MngProvider>
        <EditSettingForm />
      </MngProvider>
    </div>
  );
}
