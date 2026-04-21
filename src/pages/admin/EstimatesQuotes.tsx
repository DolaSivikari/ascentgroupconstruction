import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { EstimatesQuotesTable } from "@/components/admin/inbox/EstimatesQuotesTable";
import { DollarSign } from "lucide-react";

export default function EstimatesQuotes() {
  return (
    <AdminPageLayout
      title="Estimates & Quotes"
      description="Track every estimate and quote request — search, filter by status, and update progress as leads move through your pipeline."
      icon={<DollarSign className="h-6 w-6" />}
    >
      <EstimatesQuotesTable />
    </AdminPageLayout>
  );
}
