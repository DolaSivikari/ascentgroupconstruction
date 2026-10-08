import type { ReactNode } from "react";
import {
  Mail,
  Phone,
  UserRound,
  FileText,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/Button";
import { STATUS_LABELS } from "@/lib/inbox/model";
import { formatLeadReceived } from "@/lib/leads/model";
import { cn } from "@/lib/utils";

export function RequestDetailShell({
  open = true,
  onClose,
  name,
  type,
  status,
  reference,
  receivedAt,
  email,
  phone,
  company,
  children,
  footer,
  dirty = false,
  description,
}: {
  open?: boolean;
  onClose: () => void;
  name: string;
  type: string;
  status?: string | null;
  reference?: string;
  receivedAt?: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  dirty?: boolean;
  description?: string;
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent className="request-detail-shell flex h-dvh w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
        <SheetHeader className="request-detail-header shrink-0 space-y-4 border-b px-5 py-5 text-left sm:px-7 sm:py-6">
          <div className="flex min-w-0 items-start gap-3 pr-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Request details{reference ? ` · ${reference}` : ""}
              </p>
              <SheetTitle className="break-words text-2xl font-semibold leading-tight">
                {name}
              </SheetTitle>
              {company && (
                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {company}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{type}</Badge>
            {status && (
              <Badge
                className="capitalize"
                variant={
                  status === "new"
                    ? "warning"
                    : ["won", "completed", "resolved"].includes(status)
                      ? "success"
                      : "secondary"
                }
              >
                {STATUS_LABELS[status] || status.replace(/_/g, " ")}
              </Badge>
            )}
            <SheetDescription className="flex min-w-0 items-center gap-1.5 text-xs">
              <CalendarDays
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              {description ||
                (receivedAt
                  ? `Received ${formatLeadReceived(receivedAt)} · Toronto time`
                  : "Received time unavailable")}
            </SheetDescription>
          </div>
          {(email || phone) && (
            <div className="flex flex-wrap gap-2">
              {email && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${email}`} aria-label={`Email ${name}`}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email client
                  </a>
                </Button>
              )}
              {phone && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${phone}`} aria-label={`Call ${name}`}>
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call client
                  </a>
                </Button>
              )}
            </div>
          )}
        </SheetHeader>
        <div
          data-request-detail-scroll
          className="request-detail-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7"
        >
          {children}
        </div>
        {footer && (
          <footer className="request-detail-footer shrink-0 border-t bg-card px-5 py-4 sm:px-7">
            {dirty && (
              <p
                role="status"
                className="mb-2 text-xs font-medium text-amber-700 dark:text-amber-300"
              >
                Unsaved changes
              </p>
            )}
            {footer}
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function RequestDetailCard({
  title,
  icon: Icon = FileText,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "request-detail-card rounded-xl border bg-card p-4 sm:p-5",
        className,
      )}
    >
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function RequestDetailField({
  label,
  value,
  link,
  wide = false,
}: {
  label: string;
  value: ReactNode;
  link?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("min-w-0 space-y-1", wide && "sm:col-span-2")}>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
        {link ? (
          <a href={link} className="break-all text-primary hover:underline">
            {value}
          </a>
        ) : (
          value || (
            <span className="font-normal text-muted-foreground">
              Not provided
            </span>
          )
        )}
      </dd>
    </div>
  );
}
