'use client';

import { useRouter } from 'next/navigation';
import Button from '../button';
import '@/src/scss/_modal.scss';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Modal({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();
  const modalRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(true);

  const closeModalHandler = useCallback(
    (e: MouseEvent) => {
      if (isOpen && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
        router.back();
      } else return;
    },
    [isOpen, router]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', closeModalHandler);
      return () => document.removeEventListener('mousedown', closeModalHandler);
    } else document.body.style.overflow = 'unset';
  }, [isOpen, closeModalHandler]);

  return (
    <div className='modal'>
      <div ref={modalRef} className='contents'>
        <div className='top'>
          <h4>{title}</h4>
          <Button
            onClick={() => {
              router.back();
              setIsOpen(false);
            }}
            label='닫기'
            type='icon-only'
            size='min'
            icon='cross'
            state='secondary'
          />
        </div>
        {children}
      </div>
      <div className='modal-bg'></div>
    </div>
  );
}
