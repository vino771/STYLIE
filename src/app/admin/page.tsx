"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStylie } from '@/context/StylieContext';

export default function AdminRoot() {
  const { isAdminAuthenticated } = useStylie();
  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [isAdminAuthenticated]);

  return null;
}
