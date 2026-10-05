import { template as inquiryAlert } from "./inquiry-alert.tsx";
import { template as inquiryConfirmation } from "./inquiry-confirmation.tsx";
/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";

export interface TemplateEntry {
  component: React.ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  to?: string;
  displayName?: string;
  previewData?: Record<string, any>;
}

import { template as rfpCustomerConfirmation } from "./rfp-customer-confirmation.tsx";
import { template as rfpInternalNotification } from "./rfp-internal-notification.tsx";
import { template as reviewRequest } from "./review-request.tsx";

export const TEMPLATES: Record<string, TemplateEntry> = {
  "inquiry-alert": inquiryAlert,
  "inquiry-confirmation": inquiryConfirmation,
  "rfp-customer-confirmation": rfpCustomerConfirmation,
  "rfp-internal-notification": rfpInternalNotification,
  "review-request": reviewRequest,
};
