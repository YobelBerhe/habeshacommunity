import { useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { logger } from '@/utils/logger';

export default function BootstrapAuth() {
  const init = useAuth(s => s.init);
  
  useEffect(() => {
    logger.info('🚀 BootstrapAuth: Initializing auth...');
    init();
  }, [init]);
  
  return null;
}