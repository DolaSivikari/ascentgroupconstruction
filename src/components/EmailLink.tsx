import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailLinkProps {
  encoded: string; // Base64 encoded email
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * EmailLink component with obfuscation to protect from spam bots
 * Usage: <EmailLink encoded={btoa('info@ascentgroupconstruction.com')} />
 */
export const EmailLink = ({ 
  encoded, 
  className, 
  showIcon = false,
  children 
}: EmailLinkProps) => {
  const [email, setEmail] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Decode email on client-side only (not during SSR)
    // Add small delay to further obfuscate from bots
    const timer = setTimeout(() => {
      try {
        const decoded = atob(encoded);
        setEmail(decoded);
      } catch (error) {
        console.error('Failed to decode email:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [encoded]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      setIsRevealed(true);
      window.location.href = `mailto:${email}`;
    }
  };

  if (!email) {
    // Loading state - show placeholder
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        {showIcon && <Mail className="w-4 h-4" />}
        <span className="opacity-50">Loading...</span>
      </span>
    );
  }

  return (
    <a
      href={isRevealed ? `mailto:${email}` : '#'}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 hover:text-primary transition-colors',
        className
      )}
      aria-label="Send email"
    >
      {showIcon && <Mail className="w-4 h-4" />}
      <span>{children || email}</span>
    </a>
  );
};

// Pre-encoded email for Ascent Group Construction
export const ASCENT_EMAIL_ENCODED = btoa('info@ascentgroupconstruction.com');

// Convenience component for Ascent email
export const AscentEmailLink = ({ 
  className, 
  showIcon = true 
}: Omit<EmailLinkProps, 'encoded'>) => (
  <EmailLink 
    encoded={ASCENT_EMAIL_ENCODED} 
    className={className} 
    showIcon={showIcon} 
  />
);
