'use client';

import MngTable from '@/src/components/table/mngTable';
import { MngProvider } from '@/src/store/mngProvider';

export default function MngAgencies() {
  return (
    <div className='contain'>
      <h2 className='sub-title'>등록 기관 관리</h2>
      <MngProvider>
        <MngTable />
      </MngProvider>
    </div>
  );
}
