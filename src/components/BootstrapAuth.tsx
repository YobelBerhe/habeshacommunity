import { useEffect } from 'react';
import { useAuth } from '@/store/auth';

export default function BootstrapAuth() {
  const init = useAuth(s => s.init);
  
  useEffect(() => {
    console.log('🚀 BootstrapAuth: Initializing auth...');
    init();
  }, [init]);
  
  return null;
}