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

interface ReviewRequestProps {
  clientName?: string
  reviewLandingPage?: string
  googleReviewLink?: string
  homestarsReviewLink?: string
  trustedprosReviewLink?: string
}

const ReviewRequestEmail = ({
  clientName,
  reviewLandingPage,
  googleReviewLink,
  homestarsReviewLink,
  trustedprosReviewLink,
}: ReviewRequestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      {clientName ? `${clientName}, ` : ''}we'd love your feedback on our work
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={tagline}>Building Envelope & Restoration Specialists</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            {clientName ? `Thank you, ${clientName}` : 'Thank you for choosing us'}
          </Heading>
          <Text style={text}>
            It was a pleasure working with you. Your feedback helps us improve
            and helps other property owners and managers find a contractor they
            can trust.
          </Text>
          <Text style={text}>
            Would you take a moment to share your experience? It only takes a
            minute.
          </Text>

          {reviewLandingPage && (
            <Section style={ctaWrap}>
              <Button href={reviewLandingPage} style={button}>
                Leave a Review
              </Button>
            </Section>
          )}

          {(googleReviewLink || homestarsReviewLink || trustedprosReviewLink) && (
            <>
              <Heading style={h2}>Or review us directly</Heading>
              {googleReviewLink && (
                <Text style={linkRow}>
                  <a href={googleReviewLink} style={link}>Google</a>
                </Text>
              )}
              {homestarsReviewLink && (
                <Text style={linkRow}>
                  <a href={homestarsReviewLink} style={link}>HomeStars</a>
                </Text>
              )}
              {trustedprosReviewLink && (
                <Text style={linkRow}>
                  <a href={trustedprosReviewLink} style={link}>TrustedPros</a>
                </Text>
              )}
            </>
          )}

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
  component: ReviewRequestEmail,
  subject: (data: Record<string, any>) =>
    data?.clientName
      ? `${data.clientName}, share your experience with ${SITE_NAME}`
      : `Share your experience with ${SITE_NAME}`,
  displayName: 'Review request',
  previewData: {
    clientName: 'Jane Smith',
    reviewLandingPage: 'https://ascentgroupconstruction.com/reviews?r=preview',
    googleReviewLink: 'https://g.page/r/example/review',
    homestarsReviewLink: 'https://homestars.com/companies/example',
    trustedprosReviewLink: 'https://trustedpros.ca/company/example',
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
  fontSize: '14px',
  fontWeight: 'bold' as const,
  color: '#003366',
  margin: '24px 0 10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const linkRow = { fontSize: '14px', margin: '0 0 6px' }
const link = { color: '#003366', textDecoration: 'underline' }
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