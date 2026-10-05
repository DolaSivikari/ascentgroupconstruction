import * as React from "npm:react@18.3.1";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";
const InquiryConfirmation = ({
  contact_name,
  reference_code,
}: Record<string, string>) => (
  <Html>
    <Head />
    <Preview>Your request has been received</Preview>
    <Body style={{ fontFamily: "Arial, sans-serif" }}>
      <Container>
        <Heading>Ascent Group Construction</Heading>
        <Text>Thank you, {contact_name}. Your request has been saved.</Text>
        <Text>Reference: {reference_code}</Text>
        <Text>Please include this reference when following up.</Text>
      </Container>
    </Body>
  </Html>
);
export const template: TemplateEntry = {
  component: InquiryConfirmation,
  subject: "Ascent Group Construction — request received",
  displayName: "Inquiry confirmation",
};
