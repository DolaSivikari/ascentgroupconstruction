/**
 * Status management utilities
 */

export type ProjectStatus = 'lead' | 'quoted' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type EstimateStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired' | 'converted';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

/**
 * Get badge color variant for project status
 */
export const getProjectStatusColor = (status: ProjectStatus): string => {
  const colors: Record<ProjectStatus, string> = {
    lead: 'bg-muted/20 text-muted-foreground border-border/30',
    quoted: 'bg-info/20 text-info border-info/30',
    scheduled: 'bg-accent/20 text-accent-foreground border-accent/30',
    in_progress: 'bg-warning/20 text-warning border-warning/30',
    completed: 'bg-success/20 text-success border-success/30',
    cancelled: 'bg-danger/20 text-danger/80 border-danger/30',
  };
  return colors[status] || colors.lead;
};

/**
 * Get badge color variant for estimate status
 */
export const getEstimateStatusColor = (status: EstimateStatus): string => {
  const colors: Record<EstimateStatus, string> = {
    draft: 'bg-muted/20 text-muted-foreground border-border/30',
    sent: 'bg-info/20 text-info border-info/30',
    viewed: 'bg-accent/20 text-accent-foreground border-accent/30',
    accepted: 'bg-success/20 text-success border-success/30',
    rejected: 'bg-danger/20 text-danger/80 border-danger/30',
    expired: 'bg-warning/20 text-warning border-warning/30',
    converted: 'bg-success/20 text-success border-emerald-500/30',
  };
  return colors[status] || colors.draft;
};

/**
 * Get badge color variant for invoice status
 */
export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const colors: Record<InvoiceStatus, string> = {
    draft: 'bg-muted/20 text-muted-foreground border-border/30',
    sent: 'bg-info/20 text-info border-info/30',
    viewed: 'bg-accent/20 text-accent-foreground border-accent/30',
    paid: 'bg-success/20 text-success border-success/30',
    partially_paid: 'bg-warning/20 text-warning border-warning/30',
    overdue: 'bg-danger/20 text-danger/80 border-danger/30',
    cancelled: 'bg-muted/20 text-muted-foreground border-border/30',
  };
  return colors[status] || colors.draft;
};

/**
 * Format status for display
 */
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Check if invoice is overdue
 */
export const isInvoiceOverdue = (dueDate: string | null, status: InvoiceStatus): boolean => {
  if (!dueDate || status === 'paid' || status === 'cancelled') return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

/**
 * Determine invoice status based on payment
 */
export const determineInvoiceStatus = (
  totalCents: number,
  paidCents: number,
  dueDate: string | null,
  currentStatus: InvoiceStatus
): InvoiceStatus => {
  if (currentStatus === 'draft' || currentStatus === 'cancelled') {
    return currentStatus;
  }
  
  if (paidCents >= totalCents) {
    return 'paid';
  }
  
  if (paidCents > 0) {
    return 'partially_paid';
  }
  
  if (isInvoiceOverdue(dueDate, currentStatus)) {
    return 'overdue';
  }
  
  return currentStatus;
};
