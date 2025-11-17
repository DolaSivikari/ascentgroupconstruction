import { ReactNode } from 'react';
import { useIdleTimeout } from '@/hooks/useIdleTimeout';
import { SessionWarningDialog } from './SessionWarningDialog';

interface IdleTimeoutWrapperProps {
  children: ReactNode;
}

export const IdleTimeoutWrapper = ({ children }: IdleTimeoutWrapperProps) => {
  const { showWarning, remainingTime, extendSession } = useIdleTimeout();

  return (
    <>
      {children}
      <SessionWarningDialog
        open={showWarning}
        remainingTime={remainingTime}
        onExtend={extendSession}
      />
    </>
  );
};
