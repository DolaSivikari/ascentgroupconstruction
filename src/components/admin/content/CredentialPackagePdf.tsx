import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { CredentialDocument } from "@/lib/admin/credentials";
import {
  COMPANY_NAME,
  COMPANY_EMAIL,
  COMPANY_PHONE,
} from "@/constants/company";
const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#15263e",
  },
  brand: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  title: { fontSize: 18, marginTop: 24, marginBottom: 14 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d9e0e7",
  },
  small: { color: "#526477", fontSize: 9, marginTop: 5 },
  footer: { marginTop: 28, fontSize: 9 },
});
export async function renderCredentialPackage(
  title: string,
  expiry: string,
  links: { document: CredentialDocument; url: string | null }[],
) {
  return pdf(
    <Document title={title} author={COMPANY_NAME}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>{COMPANY_NAME}</Text>
        <Text>
          {COMPANY_PHONE} · {COMPANY_EMAIL}
        </Text>
        <Text style={styles.title}>{title}</Text>
        <Text>
          This package links to the documents selected by our administrator.
          Document contents govern their scope and validity.
        </Text>
        {links.map(({ document, url }) => (
          <View style={styles.row} key={document.id} wrap={false}>
            {url ? (
              <Link src={url}>{document.title}</Link>
            ) : (
              <Text>{document.title} (preview only)</Text>
            )}
            <Text style={styles.small}>
              Version {document.version} ·{" "}
              {document.expiry_date
                ? `Document expiry: ${document.expiry_date}`
                : "Document expiry not recorded"}
            </Text>
          </View>
        ))}
        <Text style={styles.footer}>
          Access expires:{" "}
          {new Date(expiry).toLocaleString("en-CA", {
            timeZone: "America/Toronto",
            timeZoneName: "short",
          })}
          . Links may also be revoked by our administrator. This index does not
          make new certification or insurance claims.
        </Text>
      </Page>
    </Document>,
  ).toBlob();
}
