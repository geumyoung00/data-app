'use client';

import Modal from '@/src/components/modal/modal';
import MngTable from '@/src/components/table/mngTable';
import { MngProvider } from '@/src/store/mngProvider';

export default function MngAgenciesModal() {
  return (
    <Modal title='등록 기관 관리'>
      <MngProvider>
        <div className='modal-table'>
          <MngTable />
        </div>
      </MngProvider>
    </Modal>
  );
}
