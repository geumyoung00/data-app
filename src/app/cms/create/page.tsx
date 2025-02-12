import { MngProvider } from '@/src/store/mngProvider';
import CreateSettingsForm from './createForm';

export default function CreateSettingsPage() {
  return (
    <div className='contain'>
      <h2 className='sub-title'>수집 데이터 등록</h2>
      <MngProvider>
        <CreateSettingsForm />
      </MngProvider>
    </div>
  );
}
