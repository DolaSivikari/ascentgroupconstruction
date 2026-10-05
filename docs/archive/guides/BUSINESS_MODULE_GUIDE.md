# Business Module Guide

## Overview

The Business Module is a comprehensive client, project, and financial management system designed for construction companies. It provides tools for managing clients, creating estimates, tracking projects, and generating invoices.

## Database Schema

### Tables

#### `clients`
- **id** (uuid, primary key)
- **name** (text, required) - Client company name
- **contact_name** (text) - Primary contact person
- **email** (text)
- **phone** (text)
- **address** (text)
- **notes** (text) - Internal notes
- **created_at** (timestamp)
- **updated_at** (timestamp)

#### `business_projects`
- **id** (uuid, primary key)
- **client_id** (uuid, foreign key → clients)
- **name** (text, required) - Project name
- **description** (text)
- **status** (enum: 'pending', 'in_progress', 'completed', 'on_hold')
- **start_date** (date)
- **end_date** (date)
- **budget** (numeric)
- **created_at** (timestamp)
- **updated_at** (timestamp)

#### `estimates`
- **id** (uuid, primary key)
- **client_id** (uuid, foreign key → clients)
- **project_id** (uuid, foreign key → business_projects, optional)
- **estimate_number** (text, unique) - Auto-generated
- **title** (text, required)
- **description** (text)
- **line_items** (jsonb[]) - Array of {description, quantity, unit_price, total}
- **subtotal** (numeric)
- **tax_rate** (numeric)
- **tax_amount** (numeric)
- **total** (numeric)
- **status** (enum: 'draft', 'sent', 'accepted', 'rejected')
- **valid_until** (date)
- **notes** (text)
- **created_at** (timestamp)
- **updated_at** (timestamp)

#### `invoices`
- **id** (uuid, primary key)
- **client_id** (uuid, foreign key → clients)
- **project_id** (uuid, foreign key → business_projects, optional)
- **estimate_id** (uuid, foreign key → estimates, optional)
- **invoice_number** (text, unique) - Auto-generated
- **line_items** (jsonb[])
- **subtotal** (numeric)
- **tax_rate** (numeric)
- **tax_amount** (numeric)
- **total** (numeric)
- **status** (enum: 'draft', 'sent', 'paid', 'overdue', 'cancelled')
- **issue_date** (date)
- **due_date** (date)
- **paid_date** (date, optional)
- **notes** (text)
- **created_at** (timestamp)
- **updated_at** (timestamp)

## Features

### Client Management (`/admin/business/clients`)
- Add, edit, delete clients
- Track contact information
- View client project history
- Client notes and communication log

### Project Management (`/admin/business/projects`)
- Create and track construction projects
- Link projects to clients
- Monitor project status (pending, in progress, completed, on hold)
- Track budgets and timelines
- Project milestone tracking

### Estimate Creation (`/admin/business/estimates`)
- Generate professional estimates
- Line item editor with quantity, unit price, and totals
- Automatic subtotal and tax calculation
- Send estimates to clients
- Track estimate status (draft, sent, accepted, rejected)
- Convert accepted estimates to invoices
- Set expiration dates

### Invoice Management (`/admin/business/invoices`)
- Create invoices from estimates or standalone
- Track payment status
- Automatic late fee calculation
- Invoice numbering system
- Due date tracking
- Payment recording

## Components

### `CurrencyInput.tsx`
Formatted currency input component with:
- Automatic formatting with $ symbol
- Comma separators for thousands
- Decimal precision control
- Number-only validation

### `LineItemEditor.tsx`
Dynamic line item management for estimates/invoices:
- Add/remove line items
- Quantity × Unit Price = Total calculation
- Drag-to-reorder functionality
- Inline editing
- Real-time subtotal updates

## Utilities

### `calculations.ts`
Financial calculation functions:
- `calculateSubtotal(lineItems)` - Sum of all line items
- `calculateTax(subtotal, taxRate)` - Tax amount
- `calculateTotal(subtotal, taxAmount)` - Final total
- `formatCurrency(amount)` - Display formatting

### `currency.ts`
Currency formatting utilities:
- `parseCurrency(value)` - Convert string to number
- `formatForDisplay(value)` - Format for UI
- `formatForStorage(value)` - Format for database

## Usage Instructions

### Creating a New Estimate

1. Navigate to `/admin/business/estimates`
2. Click "New Estimate"
3. Select client (or create new client)
4. Enter estimate details
5. Add line items:
   - Description
   - Quantity
   - Unit price
6. Set tax rate (default 13% HST for Ontario)
7. Review calculated totals
8. Set expiration date
9. Save as draft or send to client

### Converting Estimate to Invoice

1. Go to estimate detail page
2. Verify estimate is "accepted"
3. Click "Convert to Invoice"
4. System auto-populates:
   - Client information
   - All line items
   - Totals
5. Set issue date and due date
6. Review and finalize
7. Send invoice to client

### Recording Invoice Payment

1. Open invoice
2. Click "Record Payment"
3. Enter payment date
4. Enter amount received
5. Add payment notes (check #, payment method)
6. Status automatically updates to "paid"

## Integration Points

### With Quote System
- Convert quote requests into estimates
- Link public RFP submissions to business clients
- Track quote-to-project conversion rate

### With Project Portfolio
- Link business projects to public portfolio projects
- Sync project status and completion dates
- Display project images in estimates/invoices

### With Contact System
- Auto-create clients from contact form submissions
- Sync client contact information
- Track communication history

## Future Enhancements

### Phase 1 (Recommended)
- [ ] Email estimate/invoice sending (integrate with Resend)
- [ ] PDF generation for estimates/invoices
- [ ] Client portal (view estimates, pay invoices online)
- [ ] Payment gateway integration (Stripe)

### Phase 2
- [ ] Recurring invoices
- [ ] Purchase orders
- [ ] Expense tracking
- [ ] Profit margin analysis
- [ ] Project cost tracking vs. budget
- [ ] Time tracking integration

### Phase 3
- [ ] Multi-currency support
- [ ] Custom branding per client
- [ ] Advanced reporting and analytics
- [ ] QuickBooks/Xero integration
- [ ] Mobile app for field updates

## Technical Notes

### RLS Policies
All tables require authentication and enforce user-level access control. Only admin users can access the business module.

### Performance Considerations
- Estimates and invoices use JSONB for line items (indexed for fast queries)
- Client search uses trigram indexes for fuzzy matching
- Invoice aging queries use database functions for efficiency

### Security
- Financial data requires admin role
- Audit log tracks all changes to invoices/estimates
- Sensitive client data encrypted at rest
- PII handling follows GDPR guidelines

## Support & Development

For questions or feature requests, contact the development team or file an issue in the project repository.

**Status:** Ready for activation when needed  
**Last Updated:** 2024-11-13  
**Maintained By:** Admin Team
