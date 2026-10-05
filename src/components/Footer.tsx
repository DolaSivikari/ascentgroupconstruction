import { httpsSocialLinks } from "@/lib/publicSettings";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Shield,
  Award,
  FileCheck,
  Building2,
} from "lucide-react";

import { COMPANY_EMAIL, COMPANY_PHONE } from "@/constants/company";
import { PUBLIC_SITE_SETTINGS_COLUMNS } from "@/constants/siteSettingsColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { UnifiedFooter } from "./footer/UnifiedFooter";
import { SERVICE_REGISTRY } from "@/data/service-registry";

type SiteSettingsRow = Partial<
  Database["public"]["Tables"]["site_settings"]["Row"]
>;
type FooterSettingsRow = Pick<
  Database["public"]["Tables"]["footer_settings"]["Row"],
  | "id"
  | "social_media"
  | "contact_info"
  | "quick_links"
  | "sectors_links"
  | "trust_bar_items"
  | "is_active"
>;
type ServiceLink = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  "name" | "slug" | "service_tier"
>;
type FooterLink = { label: string; href: string };

const toFooterLinks = (value: unknown): FooterLink[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is FooterLink => {
    if (!item || typeof item !== "object") return false;
    const rec = item as Record<string, unknown>;
    return typeof rec.label === "string" && typeof rec.href === "string";
  });
};

const Footer = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRow | null>(
    null,
  );
  const [footerSettings, setFooterSettings] =
    useState<FooterSettingsRow | null>(null);
  const [services, setServices] = useState<ServiceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [siteData, footerData, servicesData] = await Promise.all([
          supabase
            .from("site_settings")
            .select(PUBLIC_SITE_SETTINGS_COLUMNS)
            .eq("is_active", true)
            .single(),
          supabase
            .from("footer_settings")
            .select(
              "id,social_media,contact_info,quick_links,sectors_links,trust_bar_items,is_active",
            )
            .eq("is_active", true)
            .single(),
          supabase
            .from("services")
            .select("name, slug, service_tier")
            .eq("publish_state", "published")
            .order("service_tier, name"),
        ]);

        if (siteData.data) setSiteSettings(siteData.data as SiteSettingsRow);
        if (footerData.data) setFooterSettings(footerData.data);
        if (servicesData.data) setServices(servicesData.data);
      } finally {
        setLoading(false);
      }
    };

    void fetchSettings();
    const refresh = () => {
      void fetchSettings();
    };
    window.addEventListener("ascent-settings-updated", refresh);
    return () => window.removeEventListener("ascent-settings-updated", refresh);
  }, []);

  // Merge DB services with the curated SERVICE_REGISTRY so static Wave 1+2
  // pages (commercial-painting-gta, etc.) also appear in the footer.
  // Registry entries with showInNav=true take priority and order; DB rows
  // not in the registry are appended afterward.
  const mergedServices = useMemo(() => {
    const seen = new Set<string>();
    const merged: ServiceLink[] = [];
    for (const entry of SERVICE_REGISTRY) {
      if (!entry.showInNav) continue;
      if (seen.has(entry.slug)) continue;
      seen.add(entry.slug);
      merged.push({
        name: entry.navLabel,
        slug: entry.slug,
        service_tier: null as any,
      });
    }
    for (const svc of services) {
      if (seen.has(svc.slug)) continue;
      seen.add(svc.slug);
      merged.push(svc);
    }
    return merged;
  }, [services]);

  // Get data from admin-managed settings
  const quickLinks = toFooterLinks(footerSettings?.quick_links);
  const sectorsLinks = toFooterLinks(footerSettings?.sectors_links);
  const trustBarItems = toFooterLinks(footerSettings?.trust_bar_items);

  const contactInfo = (footerSettings?.contact_info || {}) as any;
  const socialMedia = (footerSettings?.social_media || {}) as any;

  // Primary source: site_settings, fallback to footer_settings
  const address = siteSettings?.address || contactInfo.address || "";
  // Contact details come from app constants, not the public API, so they cannot
  // be bulk harvested from the database by scrapers.
  const phone = contactInfo.phone || COMPANY_PHONE;
  const email = contactInfo.email || COMPANY_EMAIL;
  const socialLinks = {
    ...httpsSocialLinks(siteSettings?.social_links),
    ...httpsSocialLinks(socialMedia),
  };
  const linkedinUrl = socialLinks.linkedin || "";
  const tagline =
    siteSettings?.company_tagline?.trim() ||
    "Building envelope & restoration contractor serving Ontario & GTA";

  // Static fallback links if admin hasn't configured them
  const companyLinks =
    quickLinks.length > 0
      ? quickLinks
      : [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Contact", href: "/contact" },
        ];

  const marketLinks =
    sectorsLinks.length > 0
      ? sectorsLinks
      : [
          { label: "Services", href: "/services" },
          { label: "Projects", href: "/projects" },
          { label: "Our Process", href: "/our-process" },
        ];

  const projectLinks = [
    { label: "Featured Projects", href: "/projects" },
    { label: "Commercial", href: "/projects?type=commercial" },
    { label: "Residential", href: "/projects?type=residential" },
  ];

  // Use trust bar items from admin if available, otherwise show default certifications
  const displayTrustItems = trustBarItems.length > 0;
  const certifications = [
    {
      icon: Shield,
      title: "Working Toward COR",
      subtitle: "Safety Excellence",
    },
    { icon: FileCheck, title: "WSIB Compliant", subtitle: "Full Coverage" },
    { icon: Award, title: "Fully Insured", subtitle: "$2M CGL Coverage" },
    { icon: Building2, title: "Established 2025", subtitle: "Growing in GTA" },
  ];

  if (loading) {
    return (
      <>
        <footer className="w-full bg-background border-t border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </footer>
      </>
    );
  }

  return (
    <>
      <footer className="relative w-full bg-background border-t border-border">
        {/* Main footer content */}
        <div className="container mx-auto px-6 py-8 md:py-10">
          <UnifiedFooter
            contactInfo={{ phone, email, address }}
            linkedinUrl={linkedinUrl}
            socialLinks={socialLinks}
            tagline={tagline}
            foundedYear={siteSettings?.founded_year || 2025}
            services={mergedServices}
            showLogo={false}
          />
        </div>
      </footer>
    </>
  );
};

export default Footer;
