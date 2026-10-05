import * as React from "npm:react@18.3.1";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "npm:@react-email/components@0.0.22";
import type { TemplateEntry } from "./registry.ts";
const InquiryAlert = ({
  reference_code,
  inquiry_type,
  contact_name,
  company,
  project_name,
  project_location,
  bid_due_at,
  id,
  test,
}: Record<string, string>) => (
  <Html>
    <Head />
    <Preview>
      {test ? "Test inquiry alert" : `New ${inquiry_type}: ${reference_code}`}
    </Preview>
    <Body
      style={{ backgroundColor: "#f4f6f8", fontFamily: "Arial, sans-serif" }}
    >
      <Container style={{ backgroundColor: "#fff", padding: "32px" }}>
        <Heading>Ascent Group Construction</Heading>
        <Text>
          {test
            ? "This is a test alert. No lead was created."
            : `New ${inquiry_type?.replace(/_/g, " ")} · ${reference_code}`}
        </Text>
        {!test && (
          <>
            <Text>
              {contact_name}
              {company ? ` · ${company}` : ""}
            </Text>
            <Text>
              {project_name} {project_location}
            </Text>
            {bid_due_at && (
              <Text>
                Bid due:{" "}
                {new Date(bid_due_at).toLocaleString("en-CA", {
                  timeZone: "America/Toronto",
                  timeZoneName: "short",
                })}
              </Text>
            )}
            <Button
              href={`https://www.ascentgroupconstruction.com/admin/inbox?tab=leads&source=inquiry&highlight=${encodeURIComponent(id || "")}`}
            >
              Open saved lead
            </Button>
          </>
        )}
      </Container>
    </Body>
  </Html>
);
export const template: TemplateEntry = {
  component: InquiryAlert,
  subject: (data) =>
    data.test
      ? "Ascent Group Construction — test inquiry alert"
      : `New inquiry ${data.reference_code || ""}`,
  displayName: "Inquiry alert",
};
