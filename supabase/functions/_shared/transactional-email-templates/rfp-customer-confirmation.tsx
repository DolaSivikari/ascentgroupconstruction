import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Ascent Group Construction'
const PORTFOLIO_URL = 'https://ascentgroupconstruction.com/projects'

interface RFPCustomerConfirmationProps {
  contactName?: string
  projectName?: string
  projectType?: string
  estimatedValueRange?: string
  companyName?: string
  referenceId?: string
}

const RFPCustomerConfirmationEmail = ({
  contactName,
  projectName,
  projectType,
  estimatedValueRange,
  companyName,
  referenceId,
}: RFPCustomerConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      We received your RFP{projectName ? ` for ${projectName}` : ''} — reference{' '}
      {referenceId || 'pending'}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={tagline}>Building Envelope & Restoration Specialists</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            {contactName ? `Thank you, ${contactName}` : 'Thank you for your submission'}
          </Heading>
          <Text style={text}>
            We've received your Request for Proposal and our estimating team is
            reviewing the details. You'll hear from us within 2 business days.
          </Text>

          {referenceId && (
            <Section style={refBox}>
              <Text style={refLabel}>Your reference ID</Text>
              <Text style={refValue}>{referenceId}</Text>
              <Text style={refHint}>
                Please include this ID in any follow-up correspondence.
              </Text>
            </Section>
          )}

          {(projectName || projectType || estimatedValueRange || companyName) && (
            <Section style={detailsBox}>
              <Text style={detailsHeading}>Project details</Text>
              {projectName && (
                <Text style={detailRow}>
                  <strong>Project:</strong> {projectName}
                </Text>
              )}
              {projectType && (
                <Text style={detailRow}>
                  <strong>Type:</strong> {projectType}
                </Text>
              )}
              {estimatedValueRange && (
                <Text style={detailRow}>
                  <strong>Estimated value:</strong> {estimatedValueRange}
                </Text>
              )}
              {companyName && (
                <Text style={detailRow}>
                  <strong>Company:</strong> {companyName}
                </Text>
              )}
            </Section>
          )}

          <Heading style={h2}>What happens next</Heading>
          <Text style={stepText}>
            <strong>1. Review (24–48 hours):</strong> Our estimating team
            carefully reviews your project requirements.
          </Text>
          <Text style={stepText}>
            <strong>2. Initial contact:</strong> We reach out within 2 business
            days to discuss details and clarify questions.
          </Text>
          <Text style={stepText}>
            <strong>3. Proposal:</strong> We prepare a comprehensive proposal
            tailored to your scope.
          </Text>
          <Text style={stepText}>
            <strong>4. Presentation:</strong> We schedule a meeting to walk you
            through the proposal.
          </Text>

          <Section style={ctaWrap}>
            <Button href={PORTFOLIO_URL} style={button}>
              View Our Portfolio
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Questions? Reply to this email or call{' '}
            <strong>+1 (647) 528-6804</strong>.
          </Text>
          <Text style={footer}>— The {SITE_NAME} team</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: RFPCustomerConfirmationEmail,
  subject: (data: Record<string, any>) =>
    `RFP received — ${data?.projectName || 'thank you for your submission'}`,
  displayName: 'RFP customer confirmation',
  previewData: {
    contactName: 'Jane Smith',
    projectName: 'Yorkville Residences — Facade Restoration',
    projectType: 'Multi-family',
    estimatedValueRange: '$500K – $1M',
    companyName: 'Acme Property Group',
    referenceId: 'RFP-A1B2C3D4',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '0' }
const header = {
  backgroundColor: '#003366',
  padding: '32px 32px 28px',
  textAlign: 'center' as const,
}
const brand = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px',
  letterSpacing: '0.02em',
}
const tagline = {
  color: '#cfd9e6',
  fontSize: '13px',
  margin: '0',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
}
const content = { padding: '32px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#003366',
  margin: '0 0 16px',
}
const h2 = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#003366',
  margin: '28px 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const stepText = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 10px' }
const refBox = {
  margin: '20px 0',
  padding: '20px',
  backgroundColor: '#f0f5fa',
  borderLeft: '4px solid #003366',
  borderRadius: '4px',
}
const refLabel = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#6b7280',
  margin: '0 0 6px',
}
const refValue = {
  fontSize: '20px',
  fontFamily: 'Menlo, Monaco, "Courier New", monospace',
  fontWeight: 'bold' as const,
  color: '#003366',
  margin: '0 0 8px',
  letterSpacing: '0.04em',
}
const refHint = { fontSize: '12px', color: '#6b7280', margin: '0' }
const detailsBox = {
  margin: '20px 0',
  padding: '16px 18px',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
}
const detailsHeading = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#6b7280',
  margin: '0 0 10px',
}
const detailRow = {
  fontSize: '14px',
  color: '#333333',
  lineHeight: '1.6',
  margin: '0 0 4px',
}
const ctaWrap = { textAlign: 'center' as const, margin: '28px 0 16px' }
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
const hr = { borderColor: '#e5e7eb', margin: '28px 0 20px' }
const footer = { fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 6px' }
