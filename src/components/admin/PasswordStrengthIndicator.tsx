import { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const PasswordStrengthIndicator = ({
  password,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) => {
  const requirements = useMemo((): PasswordRequirement[] => {
    return [
      { label: 'At least 12 characters', met: password.length >= 12 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { label: 'Contains number', met: /\d/.test(password) },
      { label: 'Contains special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    if (metCount === 0) return { label: 'None', color: 'bg-muted', textColor: 'text-muted-foreground' };
    if (metCount <= 2) return { label: 'Weak', color: 'bg-destructive', textColor: 'text-destructive' };
    if (metCount <= 3) return { label: 'Fair', color: 'bg-warning', textColor: 'text-warning' };
    if (metCount <= 4) return { label: 'Good', color: 'bg-accent', textColor: 'text-accent' };
    return { label: 'Strong', color: 'bg-primary', textColor: 'text-primary' };
  }, [requirements]);

  const strengthPercentage = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    return (metCount / requirements.length) * 100;
  }, [requirements]);

  if (!password && !showRequirements) return null;

  return (
    <div className="space-y-2">
      {password && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Password Strength:</span>
            <span className={`font-medium ${strength.textColor}`}>{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full card-hover ${strength.color}`}
              style={{ width: `${strengthPercentage}%` }}
            />
          </div>
        </div>
      )}

      {showRequirements && (
        <div className="space-y-1 text-sm">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2">
              {req.met ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : password ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : (
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={req.met ? 'text-primary' : 'text-muted-foreground'}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
