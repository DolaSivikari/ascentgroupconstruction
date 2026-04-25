/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as rfpCustomerConfirmation } from './rfp-customer-confirmation.tsx'
import { template as rfpInternalNotification } from './rfp-internal-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'rfp-customer-confirmation': rfpCustomerConfirmation,
  'rfp-internal-notification': rfpInternalNotification,
}
