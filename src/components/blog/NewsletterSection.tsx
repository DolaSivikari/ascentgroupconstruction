import { NewsletterForm } from "@/components/inquiry/NewsletterForm";
export default function NewsletterSection() {
  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg opacity-90 mb-6">
            Get expert tips, industry insights, and project inspiration
            delivered to your inbox.
          </p>
          <NewsletterForm source="blog" />
        </div>
      </div>
    </section>
  );
}
