import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/inquiry/NewsletterForm";
export default function NewsletterBackend() {
  return (
    <div className="footer-glass-card p-6 mb-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold text-primary-foreground">
            Stay Updated
          </h3>
        </div>
        <p className="text-sm text-primary-foreground/70 mb-4">
          Get the latest construction industry insights, project updates, and
          expert tips delivered to your inbox.
        </p>
        <NewsletterForm source="footer" />
      </div>
    </div>
  );
}
