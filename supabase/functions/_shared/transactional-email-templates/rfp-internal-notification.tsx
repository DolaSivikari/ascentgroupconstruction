import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const ADMIN_BASE = 'https://ascentgroupconstruction.com/admin/inbox'

interface RFPInternalNotificationProps {
  referenceId?: string
  rfpId?: string
  companyName?: string
  contactName?: string
  email?: string
  phone?: string
  projectName?: string
  projectType?: string
  projectLocation?: string
  estimatedValueRange?: string
  estimatedTimeline?: string
  deliveryMethod?: string
  scopeOfWork?: string
  attachmentsCount?: number
  submittedAt?: string
}

const RFPInternalNotificationEmail = ({
  referenceId,
  rfpId,
  companyName,
  contactName,
  email,
  phone,
  projectName,
  projectType,
  projectLocation,
  estimatedValueRange,
  estimatedTimeline,
  deliveryMethod,
  scopeOfWork,
  attachmentsCount,
  submittedAt,
}: RFPInternalNotificationProps) => {
  const adminUrl = rfpId
    ? `${ADMIN_BASE}?tab=rfp&highlight=${rfpId}`
    : ADMIN_BASE

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        New RFP — {companyName || 'unknown company'} —{' '}
        {projectName || 'untitled project'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={banner}>
            <Text style={bannerLabel}>New RFP Submission</Text>
            <Heading style={bannerTitle}>
              {projectName || 'Untitled project'}
            </Heading>
            {referenceId && <Text style={bannerRef}>Ref: {referenceId}</Text>}
          </Section>

          <Section style={content}>
            <Heading style={sectionH}>Contact</Heading>
            <Text style={row}><strong>Company:</strong> {companyName || '—'}</Text>
            <Text style={row}><strong>Name:</strong> {contactName || '—'}</Text>
            <Text style={row}>
              <strong>Email:</strong>{' '}
              {email ? <Link href={`mailto:${email}`} style={link}>{email}</Link> : '—'}
            </Text>
            <Text style={row}>
              <strong>Phone:</strong>{' '}
              {phone ? <Link href={`tel:${phone}`} style={link}>{phone}</Link> : '—'}
            </Text>

            <Hr style={hr} />

            <Heading style={sectionH}>Project</Heading>
            <Text style={row}><strong>Type:</strong> {projectType || '—'}</Text>
            <Text style={row}><strong>Location:</strong> {projectLocation || '—'}</Text>
            <Text style={row}><strong>Est. value:</strong> {estimatedValueRange || '—'}</Text>
            <Text style={row}><strong>Timeline:</strong> {estimatedTimeline || '—'}</Text>
            <Text style={row}><strong>Delivery method:</strong> {deliveryMethod || '—'}</Text>
            {typeof attachmentsCount === 'number' && attachmentsCount > 0 && (
              <Text style={row}>
                <strong>Attachments:</strong> {attachmentsCount} file
                {attachmentsCount === 1 ? '' : 's'}
              </Text>
            )}
            {submittedAt && (
              <Text style={row}><strong>Submitted:</strong> {submittedAt}</Text>
            )}

            {scopeOfWork && (
              <>
                <Hr style={hr} />
                <Heading style={sectionH}>Scope of work</Heading>
                <Text style={scope}>{scopeOfWork}</Text>
              </>
            )}

            <Section style={ctaWrap}>
              <Button href={adminUrl} style={button}>
                Open in Admin Inbox
              </Button>
            </Section>

            <Text style={footer}>
              This is an internal notification. Reply directly to{' '}
              {email ? (
                <Link href={`mailto:${email}`} style={link}>{email}</Link>
              ) : (
                'the submitter'
              )}{' '}
              to follow up.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: RFPInternalNotificationEmail,
  subject: (data: Record<string, any>) =>
    `[RFP] ${data?.companyName || 'Unknown'} — ${data?.projectName || 'Untitled project'}`,
  displayName: 'RFP internal notification',
  to: 'estimating@ascentgroupconstruction.com',
  previewData: {
    referenceId: 'RFP-A1B2C3D4',
    rfpId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    companyName: 'Acme Property Group',
    contactName: 'Jane Smith',
    email: 'jane@acme.example',
    phone: '+1 416 555 0199',
    projectName: 'Yorkville Residences — Facade Restoration',
    projectType: 'Multi-family',
    projectLocation: 'Toronto, ON',
    estimatedValueRange: '$500K – $1M',
    estimatedTimeline: '6–9 months',
    deliveryMethod: 'Lump sum',
    scopeOfWork: 'Full envelope assessment, EIFS repair, sealant replacement, and balcony slab edge restoration across 12 floors.',
    attachmentsCount: 3,
    submittedAt: 'April 25, 2026 at 4:12 PM EDT',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto' }
const banner = {
  backgroundColor: '#003366',
  padding: '24px 28px',
  borderLeft: '6px solid #d97706',
}
const bannerLabel = {
  color: '#fcd34d',
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  margin: '0 0 6px',
  fontWeight: 'bold' as const,
}
const bannerTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px',
}
const bannerRef = {
  color: '#cfd9e6',
  fontSize: '12px',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  margin: '0',
}
const content = { padding: '24px 28px 32px' }
const sectionH = {
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#003366',
  fontWeight: 'bold' as const,
  margin: '16px 0 10px',
}
const row = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 6px' }
const scope = {
  fontSize: '14px',
  color: '#333333',
  lineHeight: '1.6',
  margin: '0',
  padding: '12px 14px',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap' as const,
}
const link = { color: '#003366', textDecoration: 'underline' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
const ctaWrap = { textAlign: 'center' as const, margin: '24px 0 16px' }
const button = {
  backgroundColor: '#003366',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  padding: '12px 28px',
  borderRadius: '4px',
  display: 'inline-block',
}
const footer = { fontSize: '12px', color: '#6b7280', lineHeight: '1.6', margin: '12px 0 0' }
