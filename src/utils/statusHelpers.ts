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
    lead: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    quoted: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    scheduled: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return colors[status] || colors.lead;
};

/**
 * Get badge color variant for estimate status
 */
export const getEstimateStatusColor = (status: EstimateStatus): string => {
  const colors: Record<EstimateStatus, string> = {
    draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    sent: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    viewed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accepted: 'bg-green-500/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    expired: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    converted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  };
  return colors[status] || colors.draft;
};

/**
 * Get badge color variant for invoice status
 */
export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const colors: Record<InvoiceStatus, string> = {
    draft: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    sent: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    viewed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    paid: 'bg-green-500/20 text-green-300 border-green-500/30',
    partially_paid: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    overdue: 'bg-red-500/20 text-red-300 border-red-500/30',
    cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
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
