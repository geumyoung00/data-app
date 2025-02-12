import Modal from '@/src/components/modal/modal';
import { dataType, fetchDatabyId } from '@/src/db/data';

export default async function LogModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const now: dataType[] = await fetchDatabyId(id);
  const { agency_kor, collectItem, log } = now[0];

  return (
    // <Modal title={`${params.id} 상세 로그`}>
    <Modal title={`${agency_kor}/${collectItem} 상세 로그`}>
      <div className='modal-inner'>{log}</div>
    </Modal>
  );
}
